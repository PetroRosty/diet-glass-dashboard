import React, { useEffect } from 'react';

const TelegramLoginButton = () => {
  useEffect(() => {
    console.log('Initializing Telegram Login Widget...');
    
    // Создаём скрипт
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot'); // без @
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-auth-url', 'https://diet-glass-dashboard.vercel.app/api/auth/telegram');

    // Логируем все атрибуты для проверки
    console.log('Telegram Login Widget attributes:', {
      botName: script.getAttribute('data-telegram-login'),
      size: script.getAttribute('data-size'),
      userpic: script.getAttribute('data-userpic'),
      requestAccess: script.getAttribute('data-request-access'),
      authUrl: script.getAttribute('data-auth-url'),
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
