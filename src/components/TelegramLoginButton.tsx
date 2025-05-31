import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TelegramUser } from '@/types/auth';

// Объявляем тип для пропсов компонента
interface TelegramLoginButtonProps {
  onAuth?: (user: TelegramUser) => void;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  useEffect(() => {
    console.log('Setting up Telegram Login Widget...');

    // 1. Сначала объявляем глобальную функцию onTelegramAuth
    // Это ДОЛЖНО быть сделано до вставки скрипта!
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram authentication data received:', user);

      try {
        // Сразу показываем alert для отладки
        alert('Logged in as ' + user.first_name + ' ' + 
              (user.last_name || '') + ' (' + user.id + 
              (user.username ? ', @' + user.username : '') + ')');

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
          
          // Обновляем состояние через AuthProvider
          setAuthenticatedUser(authenticatedUser);
          
          // Вызываем внешний обработчик, если он передан
          if (onAuth) {
            onAuth(user);
          }

          // Перенаправляем на главную страницу
          navigate('/');
        } else {
          console.error('Server auth failed:', result.error || response.statusText);
          alert('Server authentication failed: ' + (result.error || response.statusText));
        }
      } catch (error) {
        console.error('Error during Telegram auth fetch or state update:', error);
        alert('Error during authentication: ' + (error instanceof Error ? error.message : String(error)));
      }
    };

    // 2. Теперь создаем скрипт Telegram
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    // 3. Добавляем скрипт в контейнер
    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('Found container, cleaning and appending script...');
      // Очищаем контейнер перед добавлением скрипта
      container.innerHTML = '';
      // Добавляем скрипт
      container.appendChild(script);
      console.log('Script appended to container');
    } else {
      console.error('Container telegram-login-container not found!');
    }

    // 4. Очистка при размонтировании компонента
    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      // Удаляем глобальную функцию
      delete window.onTelegramAuth;
      // Очищаем контейнер
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, [setAuthenticatedUser, navigate, onAuth]); // Зависимости для useEffect

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
