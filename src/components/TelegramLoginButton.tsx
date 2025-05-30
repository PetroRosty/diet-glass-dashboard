import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TelegramLoginButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Initializing Telegram Login Widget with data-onauth...');
    
    // Определяем глобальную функцию onTelegramAuth здесь, внутри компонента
    // чтобы она имела доступ к navigate и другим хукам/состоянию при необходимости
    (window as any).onTelegramAuth = async (user: any) => {
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
          // TODO: Обновить состояние авторизации клиента здесь
          // Например, через контекст AuthProvider

          // Используем navigate для программной навигации
          navigate('/'); // Перенаправляем на главную страницу

        } else {
          console.error('Server auth failed:', data.error || 'Unknown server error');
          // TODO: Обработка ошибки на клиенте (например, показ тоста)
          // Сейчас просто логируем ошибку. Можно использовать useToast, но его нужно передать или использовать контекст/события.
        }

      } catch (error) {
        console.error('Error sending auth data to server:', error);
        // TODO: Обработка ошибки fetch
      }
    };

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

    // Удаляем глобальную функцию и чистим контейнер при размонтировании
    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      if ((window as any).onTelegramAuth) {
         delete (window as any).onTelegramAuth;
      }
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, [navigate]);

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
