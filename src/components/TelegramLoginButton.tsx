import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const TelegramLoginButton = () => {
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing Telegram Login Widget (data-auth-url)...');
    
    // Добавляем скрипт Telegram Login Widget с data-auth-url
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    // Устанавливаем data-auth-url на наш серверный эндпоинт (например, /api/auth/telegram)
    // (замените на ваш домен, если необходимо)
    script.setAttribute('data-auth-url', 'https://diet-glass-dashboard.vercel.app/api/auth/telegram');
    script.async = true;

    // Логируем атрибуты скрипта (для отладки)
    console.log('Telegram Login Widget attributes:', {
      botName: script.getAttribute('data-telegram-login'),
      size: script.getAttribute('data-size'),
      requestAccess: script.getAttribute('data-request-access'),
      userpic: script.getAttribute('data-userpic'),
      authUrl: script.getAttribute('data-auth-url')
    });

    // Добавляем скрипт на страницу
    const container = document.getElementById('telegram-login-container');
    if (container) {
       console.log('Found container for Telegram Login Widget (data-auth-url)');
       container.appendChild(script);
    } else {
       console.error('Container (telegram-login-container) not found!');
    }

    // Очистка при размонтировании (удаляем скрипт, если он был добавлен)
    return () => {
       console.log('Cleaning up Telegram Login Widget (data-auth-url)...');
       if (container && script.parentNode) {
          container.removeChild(script);
       }
    };
  }, [toast]);

  return (
    <div id="telegram-login-container" className="flex justify-center">
      {/* Telegram Login Widget (data-auth-url) будет вставлен сюда */}
    </div>
  );
};

export default TelegramLoginButton;
