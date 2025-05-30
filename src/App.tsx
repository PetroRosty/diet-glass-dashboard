import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProProvider } from "@/contexts/ProContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TelegramAuthHandler from "@/components/TelegramAuthHandler";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log('App component mounted or location changed.');
    const queryParams = new URLSearchParams(location.search);
    console.log('Current URL search params:', location.search);
    const telegramLoginStatus = queryParams.get('telegram_login');
    console.log('telegram_login status param:', telegramLoginStatus);

    if (telegramLoginStatus === 'success') {
      // ... existing code ...
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <TelegramAuthHandler />
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
