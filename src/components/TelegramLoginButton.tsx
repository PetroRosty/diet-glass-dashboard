import React, { useEffect } from 'react';

const TelegramLoginButton = () => {
  useEffect(() => {
    // Создаём скрипт
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot'); // без @
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-auth-url', 'https://diet-glass-dashboard.vercel.app/api/auth/telegram');

    // Добавляем скрипт в контейнер
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.innerHTML = ''; // чистим контейнер перед вставкой
      container.appendChild(script);
    }

    // Удаляем скрипт при размонтировании
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div id="telegram-login-container" className="flex justify-center"></div>
  );
};

export default TelegramLoginButton;
