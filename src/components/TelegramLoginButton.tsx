import React, { useEffect } from 'react';

const TelegramLoginButton = () => {
  useEffect(() => {
    console.log('Initializing Telegram Login Widget with data-onauth...');
    
    // Создаём скрипт
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot'); // без @
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    // Логируем все атрибуты для проверки
    console.log('Telegram Login Widget attributes:', {
      botName: script.getAttribute('data-telegram-login'),
      size: script.getAttribute('data-size'),
      userpic: script.getAttribute('data-userpic'),
      requestAccess: script.getAttribute('data-request-access'),
      onauth: script.getAttribute('data-onauth'),
      src: script.src
    });

    // Добавляем скрипт в контейнер
    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('Found container, cleaning and appending script...');
      container.innerHTML = ''; // чистим контейнер перед вставкой
      container.appendChild(script);
      console.log('Script appended to container');
    } else {
      console.error('Container telegram-login-container not found!');
    }

    // Удаляем скрипт при размонтировании
    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, []);

  return (
    <div id="telegram-login-container" className="flex justify-center"></div>
  );
};

export default TelegramLoginButton;

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

window.onTelegramAuth = async (user: any) => {
  console.log('Telegram authentication data received:', user);

  // Отправить данные пользователя на сервер для проверки hash и авторизации
  try {
    console.log('Sending Telegram auth data to server...');
    const res = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    const data = await res.json();
    console.log('Server response:', data);

    if (res.ok && data.success) {
      console.log('Server auth successful');
      // TODO: Обработка успешной авторизации на клиенте (например, сохранение сессии, редирект)
      // Сейчас просто редирект на главную для теста
      window.location.href = '/';
    } else {
      console.error('Server auth failed:', data.error || 'Unknown server error');
      // TODO: Обработка ошибки на клиенте (например, показ сообщения)
      // Сейчас просто показ ошибки в консоли и, возможно, тост
      // Возможно, вы захотите использовать useToast здесь, но прямые хуки в window.onTelegramAuth нельзя использовать.
      // Можно передать функцию показа тоста или использовать глобальное событие.
      // Пока просто логируем ошибку.
    }

  } catch (error) {
    console.error('Error sending auth data to server:', error);
    // TODO: Обработка ошибки fetch (например, показ сообщения)
  }
};
