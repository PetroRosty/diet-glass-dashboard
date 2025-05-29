import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProProvider } from "@/contexts/ProContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useToast } from '@/hooks/use-toast';
import React, { useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { user, loginWithTelegram } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const telegramLoginStatus = params.get('telegram_login');

    if (telegramLoginStatus === 'success') {
      toast({ title: "Вход выполнен!", description: "Вы вошли через Telegram." });
      window.history.replaceState({}, document.title, location.pathname);

    } else if (telegramLoginStatus === 'failed') {
      toast({ title: "Ошибка!", description: "Ошибка входа через Telegram.", variant: "destructive" });
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, toast, user, loginWithTelegram]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ProProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
