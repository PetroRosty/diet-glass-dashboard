import React, { useEffect } from 'react';

const TelegramLoginButton = () => {
  useEffect(() => {
    console.log('Setting up simple Telegram Login Widget...');

    // Простая функция, как на официальном сайте
    window.onTelegramAuth = (user: any) => {
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + 
            ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
    };

    // Создаем скрипт точно как в официальном примере
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'small'); // Используем small как в примере
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    console.log('Telegram Login Widget attributes:', {
      botName: script.getAttribute('data-telegram-login'),
      size: script.getAttribute('data-size'),
      onauth: script.getAttribute('data-onauth'),
      requestAccess: script.getAttribute('data-request-access'),
      src: script.src
    });

    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('Found container, cleaning and appending script...');
      container.innerHTML = '';
      container.appendChild(script);
      console.log('Script appended to container');
    } else {
      console.error('Container telegram-login-container not found!');
    }

    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      delete window.onTelegramAuth;
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, []); // Пустой массив зависимостей, так как у нас простая версия

  return (
    <div id="telegram-login-container" className="flex justify-center"></div>
  );
};

// Объявляем глобальный тип для window.onTelegramAuth
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export default TelegramLoginButton;
