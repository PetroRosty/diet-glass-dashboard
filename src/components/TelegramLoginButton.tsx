import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TelegramUser, User } from '@/types/auth';

const TelegramLoginButton = () => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  useEffect(() => {
    console.log('Initializing Telegram Login Widget with data-onauth...');
    
    (window as any).onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram authentication data received:', user);

      try {
        console.log('Sending Telegram auth data to server for verification and upsert...');
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });

        const data = await res.json();
        console.log('Server response:', data);

        if (res.ok && data.success) {
          console.log('Server auth successful, updating client state...');
          const authenticatedUser: User = {
            id: user.id.toString(),
            name: `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`,
            email: user.username ? `${user.username}@telegram.user` : `${user.id}@telegram.user`,
            avatar: user.photo_url,
            isPro: data.user?.is_pro || false,
            loginMethod: 'telegram'
          };

          setAuthenticatedUser(authenticatedUser);

        } else {
          console.error('Server auth failed:', data.error || 'Unknown server error');
          navigate('/login?error=telegram_auth_failed');
        }

      } catch (error) {
        console.error('Error sending auth data to server:', error);
        navigate('/login?error=network_error');
      }
    };

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
      if ((window as any).onTelegramAuth) {
         delete (window as any).onTelegramAuth;
      }
      if (container) {
        container.innerHTML = '';
        console.log('Container cleaned');
      }
    };
  }, [setAuthenticatedUser, navigate]);

  return (
    <div id="telegram-login-container" className="flex justify-center"></div>
  );
};

export default TelegramLoginButton;

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}
