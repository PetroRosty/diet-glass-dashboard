import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TelegramUser } from '@/types/auth';

declare global {
  interface Window {
    // Removed onTelegramAuth declaration
  }
}

const TelegramLoginButton = () => {
  const { loginWithTelegram } = useAuth(); // Keep useAuth if login logic moves to context after auth-url redirect
  const { toast } = useToast(); // Keep useToast if needed for UI feedback after redirect

  useEffect(() => {
    console.log('Initializing Telegram Login Widget with data-auth-url...');
    
    // Add Telegram Login Widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'KalControlBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute(
      'data-auth-url',
      'https://diet-glass-dashboard.vercel.app/api/auth/telegram'
    );
    script.async = true;

    // Find and append the script to the container
    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('Found container for Telegram Login Widget, appending script.');
      container.appendChild(script);
    } else {
      console.error('Container for Telegram Login Widget not found!');
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up Telegram Login Widget...');
      if (container && script.parentNode) {
        container.removeChild(script);
      }
      // Removed delete window.onTelegramAuth;
    };
  }, []); // Depend on empty array as script injection logic is static

  // Consider if you still need useAuth and useToast here or if they should be used on the redirect page

  return (
    <div id="telegram-login-container" className="flex justify-center">
      {/* Telegram Login Widget will be inserted here */}
    </div>
  );
};

export default TelegramLoginButton;
