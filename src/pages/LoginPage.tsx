
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import TelegramLoginButton from '@/components/TelegramLoginButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему.",
      });
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль. Попробуйте снова.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-gray-400 text-sm">Войдите в свой аккаунт, чтобы продолжить</p>
          </div>

          {/* Telegram Login */}
          <div className="mb-6">
            <TelegramLoginButton />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">или войдите через email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="anna@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-fitness-blue"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-fitness-blue"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-600 text-fitness-blue focus:ring-fitness-blue"
                />
                <span className="text-sm text-gray-300">Запомнить меня</span>
              </label>
              <button type="button" className="text-sm text-fitness-blue hover:text-blue-400">
                Забыли пароль?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fitness-blue hover:bg-blue-600 text-white"
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Нет аккаунта?{' '}
              <button className="text-fitness-blue hover:text-blue-400">
                Зарегистрироваться
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Демо-вход: anna@example.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
