import React from 'react';
import { useToast } from '@/hooks/use-toast';

const TelegramLoginButton = () => {
  const { toast } = useToast();

  return (
    <div id="telegram-login-container" className="flex justify-center">
      <script 
        async 
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="KalControlBot"
        data-size="large"
        data-userpic="true"
        data-request-access="write"
        data-auth-url="https://diet-glass-dashboard.vercel.app/api/auth/telegram"
      />
    </div>
  );
};

export default TelegramLoginButton;
