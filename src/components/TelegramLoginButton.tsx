import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TelegramUser } from '@/types/auth';

// Объявляем тип для пропсов компонента
interface TelegramLoginButtonProps {
  onAuth?: (user: TelegramUser) => void;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ onAuth }) => {
  const { setAuthenticatedUser } = useAuth();

  useEffect(() => {
    console.log('Setting up Telegram Login Widget...');

    // 1. Сначала объявляем глобальную функцию onTelegramAuth
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram authentication data received:', user);

      try {
        // Сразу отправляем данные на сервер
        console.log('Sending Telegram auth data to server...');
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        const result = await response.json();
        console.log('Server response:', result);

        if (response.ok && result.success) {
          console.log('Server auth successful');
          const authenticatedUser = {
            id: result.user.telegram_id.toString(),
            name: result.user.first_name + (result.user.last_name ? ' ' + result.user.last_name : ''),
            email: result.user.username ? `${result.user.username}@telegram.user` : `${result.user.telegram_id}@telegram.user`,
            avatar: result.user.photo_url || null,
            isPro: result.user.is_pro || false,
            loginMethod: 'telegram' as 'telegram'
          };
          
          // Сохраняем в localStorage перед редиректом
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
          
          // Обновляем состояние через AuthProvider
          setAuthenticatedUser(authenticatedUser);
          
          // Вызываем внешний обработчик, если он передан
          if (onAuth) {
            onAuth(user);
          }

          // Редирект произойдет автоматически через data-redirect-url
        } else {
          console.error('Server auth failed:', result.error || response.statusText);
          alert('Server authentication failed: ' + (result.error || response.statusText));
        }
      } catch (error) {
        console.error('Error during Telegram auth fetch or state update:', error);
        alert('Error during authentication: ' + (error instanceof Error ? error.message : String(error)));
      }
    };

    // 2. Создаем скрипт Telegram с redirect-url
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    // Добавляем redirect-url - после успешной авторизации Telegram перенаправит на главную
    script.setAttribute('data-redirect-url', window.location.origin + '/');

    // 3. Добавляем скрипт в контейнер
    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('Found container, cleaning and appending script...');
      container.innerHTML = '';
      container.appendChild(script);
      console.log('Script appended to container');
    } else {
      console.error('Container telegram-login-container not found!');
    }

    // 4. Очистка при размонтировании компонента
    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      delete window.onTelegramAuth;
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, [setAuthenticatedUser, onAuth]);

  return (
    <div id="telegram-login-container" className="flex justify-center"></div>
  );
};

// Объявляем глобальный тип для window.onTelegramAuth
declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export default TelegramLoginButton;
