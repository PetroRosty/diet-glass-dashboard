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

window.onTelegramAuth = (user: any) => {
  console.log('Telegram authentication data received:', user);
  alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');

  // TODO: Отправить данные пользователя на сервер для проверки и авторизации в Supabase
  // Пример:
  // fetch('/api/auth/telegram', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(user)
  // }).then(res => res.json()).then(data => {
  //   console.log('Server response:', data);
  //   // Обработка ответа сервера (например, сохранение сессии)
  // }).catch(error => {
  //   console.error('Error sending auth data to server:', error);
  // });
};
