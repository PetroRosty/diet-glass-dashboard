import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import { createHash, createHmac } from 'crypto';
import { parse } from 'url';

// Инициализация Supabase клиента
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Key not set in environment variables.');
}

const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

// Получаем токен бота из переменных окружения
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error('Telegram bot token is not set in environment variables.');
}

// Функция для проверки подлинности данных от Telegram
const checkTelegramAuth = (data: any, botToken: string): boolean => {
  const { hash, ...otherData } = data;
  if (!hash) {
    return false;
  }

  // Сортируем данные по ключам и формируем строку для проверки
  const dataCheckString = Object.keys(otherData)
    .sort()
    .map(key => `${key}=${otherData[key]}`)
    .join('\n');

  // Вычисляем секретный ключ (SHA256 хэш токена бота)
  const secretKey = createHash('sha256').update(botToken).digest();

  // Вычисляем HMAC-SHA256 хэш строки данных с секретным ключом
  const hmac = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  // Сравниваем вычисленный хэш с полученным от Telegram
  return hmac === hash;
};

export default async (req: IncomingMessage & { query: { [key: string]: string | string[] } }, res: ServerResponse) => {
  // Получаем данные пользователя из параметров запроса
  const parsedUrl = parse(req.url || '', true);
  const userData = parsedUrl.query;

  console.log('Received Telegram auth data:', userData);

  // Проверяем подлинность данных
  if (!BOT_TOKEN || !checkTelegramAuth(userData, BOT_TOKEN)) {
    console.error('Telegram auth data check failed.');
    // В случае ошибки перенаправляем на страницу входа с индикацией ошибки
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // Проверяем актуальность данных (например, не старше 1 часа)
  const authDate = parseInt(userData.auth_date as string, 10);
  const now = Math.floor(Date.now() / 1000);
  const maxAge = 3600; // 1 час

  if (now - authDate > maxAge) {
      console.error('Telegram auth data is too old.');
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
  }

  // Данные подлинны и актуальны, обрабатываем пользователя в Supabase
  try {
    const telegramId = userData.id as string;
    const firstName = userData.first_name as string;
    const lastName = userData.last_name as string | undefined;
    const username = userData.username as string | undefined;
    const photoUrl = userData.photo_url as string | undefined;
    const locale = userData.language_code as string | undefined;
    
    // Проверяем существование пользователя
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 - not found
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }

    let profile = existingProfile;

    // Если пользователь не существует, создаем его
    if (!existingProfile) {
      console.log('Profile not found, creating new profile');
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            telegram_id: telegramId,
            first_name: firstName,
            last_name: lastName,
            username: username,
            photo_url: photoUrl,
            locale: locale,
            auth_date: authDate,
            hash: userData.hash // Сохраняем хэш для логов или отладки, если нужно
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }
      console.log('New profile created:', newProfile);
      profile = newProfile;
    }

    // Пользователь найден или создан. Теперь нужно установить сессию.
    // Простейший способ - перенаправить обратно на клиент с параметрами
    // или использовать куки/токены для управления сессией на клиенте.
    // Для примера, перенаправим на главную страницу.
    
    // В реальном приложении здесь нужно было бы: 
    // 1. Создать сессию на сервере (если используется серверное управление сессиями)
    // 2. Вернуть токен клиенту или установить куки
    // 3. Перенаправить пользователя на главную страницу или дашборд

    // Для начала просто перенаправим обратно на главную, клиентский код должен будет определить, что пользователь залогинен
    // Возможно, передадим user_id в параметрах, чтобы клиент мог его использовать для получения данных
    // ВНИМАНИЕ: передача чувствительных данных в URL небезопасна. 
    // Лучше использовать сессии или токены.
    
    // Пример редиректа с user_id (НЕ ДЛЯ PROD)
    // return res.redirect(`/?user_id=${telegramId}`);
    
    // Более безопасный вариант: клиент после редиректа проверяет наличие куки или токена,
    // который установил этот эндпоинт.
    // Или, если используете Supabase Auth, то можно использовать их сессии.
    
    // Простой редирект на главную
    res.writeHead(302, { Location: '/' });
    res.end();
    return;

  } catch (error) {
    console.error('Error processing Telegram auth or interacting with Supabase:', error);
    // В случае ошибки Supabase или другой серверной ошибки
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }
}; 