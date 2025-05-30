import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TelegramUser } from '@/types/auth';

// Объявляем тип для пропсов компонента
interface TelegramLoginButtonProps {
  onAuth?: (user: TelegramUser) => void; // Опциональный проп для внешнего обработчика
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  useEffect(() => {
    console.log('Setting up Telegram Login Widget...');

    // 1. Сначала объявляем глобальную функцию onTelegramAuth
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram authentication data received:', user);

      try {
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
        }
      } catch (error) {
        console.error('Error during Telegram auth fetch or state update:', error);
      }
    };

    // 2. Теперь создаем и добавляем скрипт Telegram
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    console.log('Telegram Login Widget attributes:', {
      botName: script.getAttribute('data-telegram-login'),
      size: script.getAttribute('data-size'),
      userpic: script.getAttribute('data-userpic'),
      requestAccess: script.getAttribute('data-request-access'),
      onauth: script.getAttribute('data-onauth'),
      src: script.src
    });

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
      // Удаляем глобальную функцию
      delete window.onTelegramAuth;
      // Очищаем контейнер
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, [setAuthenticatedUser, navigate, onAuth]); // Добавляем onAuth в зависимости

  return (
    <div id="telegram-login-container" className="flex justify-center"></div>
  );
};

// Объявляем глобальный тип для window.onTelegramAuth
declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void; // Делаем свойство опциональным
  }
}

export default TelegramLoginButton;
