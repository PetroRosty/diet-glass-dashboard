import React from 'react';
import TelegramLoginButton from '@/components/TelegramLoginButton';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-fitness-blue to-fitness-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Д</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Диет-Дневник</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Добро пожаловать</h2>
            <p className="text-gray-400 text-sm">Войдите через Telegram, чтобы продолжить</p>
          </div>

          {/* Telegram Login */}
          <div className="mb-6">
            <TelegramLoginButton />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Войдите через Telegram для доступа к вашему дневнику питания
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
