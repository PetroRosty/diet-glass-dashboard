import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TelegramUser } from '@/types/auth';

const TelegramLoginButton = () => {
  const navigate = useNavigate();
  const { loginWithTelegram } = useAuth();

  useEffect(() => {
    console.log('Initializing Telegram Login Widget with data-onauth...');
    
    (window as any).onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram authentication data received:', user);

      try {
        console.log('Calling loginWithTelegram from AuthProvider...');
        await loginWithTelegram(user);

      } catch (error) {
        console.error('Error during Telegram login process:', error);
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
  }, [loginWithTelegram]);

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
