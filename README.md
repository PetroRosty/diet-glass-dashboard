# Диет-Дневник

Приложение для отслеживания питания и диеты с интеграцией Telegram.

## Особенности

- 🔐 Аутентификация через Telegram
- 📊 Отслеживание калорий и макронутриентов
- 📱 Адаптивный дизайн
- 📈 Аналитика и отчеты
- 🤖 AI-рекомендации по питанию
- 💧 Отслеживание водного баланса

## Технологии

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Telegram Bot API
- shadcn/ui



## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/diet-dashboard.git
cd diet-dashboard
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните переменные окружения в `.env`:
- `VITE_SUPABASE_URL`: URL вашего проекта Supabase
- `VITE_SUPABASE_ANON_KEY`: Анонимный ключ Supabase

5. Запустите проект:
```bash
npm run dev
```

## Разработка

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка проекта
- `npm run preview` - предпросмотр собранного проекта

## Деплой

Проект можно развернуть на любой платформе, поддерживающей статические сайты (Vercel, Netlify, GitHub Pages).

Не забудьте настроить переменные окружения на платформе деплоя.

## Безопасность

- Все чувствительные данные хранятся в переменных окружения
- Используется анонимный ключ Supabase для клиентской части
- Аутентификация через Telegram обеспечивает безопасный вход

## Последнее обновление

- 🚀 Улучшен пользовательский интерфейс
- 🔧 Исправлены проблемы с Supabase
- 📱 Добавлена поддержка мобильных устройств
- 🎨 Обновлен дизайн компонентов

## Лицензия

MIT
