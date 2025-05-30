import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const TelegramAuthHandler = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const telegramLogin = params.get('telegram_login');

    if (telegramLogin === 'success') {
      const telegramId = params.get('telegram_id');
      const firstName = params.get('first_name');
      const username = params.get('username');

      toast({
        title: 'Успешная авторизация',
        description: `Добро пожаловать, ${firstName}!`,
      });

      // Здесь можно добавить дополнительную логику после успешной авторизации
      // Например, обновить состояние приложения, перенаправить пользователя и т.д.
      console.log('Telegram auth success:', { telegramId, firstName, username });

    } else if (telegramLogin === 'failed') {
      const error = params.get('error');
      let errorMessage = 'Произошла ошибка при авторизации';

      switch (error) {
        case 'missing_fields':
          errorMessage = 'Отсутствуют необходимые данные';
          break;
        case 'invalid_hash':
          errorMessage = 'Неверная подпись данных';
          break;
        case 'expired':
          errorMessage = 'Время авторизации истекло';
          break;
        case 'database':
          errorMessage = 'Ошибка при сохранении данных';
          break;
        case 'server_error':
          errorMessage = 'Внутренняя ошибка сервера';
          break;
        default:
          errorMessage = 'Неизвестная ошибка';
      }

      toast({
        title: 'Ошибка авторизации',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    // Очищаем URL от параметров авторизации
    if (telegramLogin) {
      const newUrl = new URL(window.location.href);
      newUrl.search = '';
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [location.search, toast]);

  return null; // Этот компонент не рендерит ничего
};

export default TelegramAuthHandler; 