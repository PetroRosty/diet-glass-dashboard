import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProProvider } from "@/contexts/ProContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TelegramAuthHandler from "@/components/TelegramAuthHandler";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log('App component mounted or location changed.');
    const queryParams = new URLSearchParams(location.search);
    console.log('Current URL search params:', location.search);
    const telegramLoginStatus = queryParams.get('telegram_login');
    console.log('telegram_login status param:', telegramLoginStatus);

    if (telegramLoginStatus === 'success') {
      const telegramId = queryParams.get('telegram_id');
      const firstName = queryParams.get('first_name');
      const username = queryParams.get('username');
      
      console.log('Telegram auth success:', { telegramId, firstName, username });
      toast({
        title: "Успешная авторизация",
        description: `Добро пожаловать, ${firstName || username || 'пользователь'}!`,
      });
      
      // Очищаем URL параметры после обработки
      window.history.replaceState({}, '', '/');
    } else if (telegramLoginStatus === 'failed') {
      const error = queryParams.get('error');
      console.error('Telegram auth failed:', error);
      toast({
        title: "Ошибка авторизации",
        description: `Не удалось войти через Telegram: ${error || 'неизвестная ошибка'}`,
        variant: "destructive",
      });
      
      // Очищаем URL параметры после обработки
      window.history.replaceState({}, '', '/');
    }
  }, [location, toast]);

  return (
    <>
      <TelegramAuthHandler />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ProProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
