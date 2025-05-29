import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TelegramUser } from '@/types/auth';

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

const TelegramLoginButton = () => {
  const { loginWithTelegram } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing Telegram Login Widget...');
    
    // Добавляем скрипт Telegram Login Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    // Логируем все атрибуты скрипта для отладки
    console.log('Telegram Login Widget attributes:', {
      botName: script.getAttribute('data-telegram-login'),
      size: script.getAttribute('data-size'),
      radius: script.getAttribute('data-radius'),
      requestAccess: script.getAttribute('data-request-access'),
      userpic: script.getAttribute('data-userpic'),
      onAuth: script.getAttribute('data-onauth')
    });

    // Определяем функцию обратного вызова
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram auth callback received:', user);
      try {
        await loginWithTelegram(user);
        console.log('Login successful');
        toast({
          title: "Добро пожаловать!",
          description: "Вы успешно вошли через Telegram.",
        });
      } catch (error) {
        console.error('Telegram login error:', error);
        toast({
          title: "Ошибка входа",
          description: "Не удалось войти через Telegram. Попробуйте снова.",
          variant: "destructive"
        });
      }
    };

    // Добавляем скрипт на страницу
    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('Found container for Telegram Login Widget');
      container.appendChild(script);
    } else {
      console.error('Container for Telegram Login Widget not found!');
    }

    // Очистка при размонтировании
    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      if (container && script.parentNode) {
        container.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [loginWithTelegram, toast]);

  return (
    <div id="telegram-login-container" className="flex justify-center">
      {/* Telegram Login Widget будет вставлен сюда */}
    </div>
  );
};

export default TelegramLoginButton;
