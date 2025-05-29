import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FeedbackForm from './FeedbackForm';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

const Header = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "До свидания!",
      description: "Вы успешно вышли из системы.",
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="glass-nav sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-fitness-blue to-fitness-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Д</span>
            </div>
            <h1 className="text-xl font-bold text-white">Диет-Дневник</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('overview')}
              className="text-white hover:text-fitness-blue transition-colors font-medium"
            >
              Обзор дня
            </button>
            <button 
              onClick={() => scrollToSection('weekly')}
              className="text-gray-400 hover:text-fitness-blue transition-colors"
            >
              Рацион за неделю
            </button>
            <button 
              onClick={() => scrollToSection('history')}
              className="text-gray-400 hover:text-fitness-blue transition-colors"
            >
              История приёмов пищи
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <FeedbackForm />
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-6 h-6 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80 bg-gray-900/95 backdrop-blur-lg border-gray-700">
              <SheetHeader>
                <SheetTitle className="text-white text-left">Профиль</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-fitness-blue to-fitness-purple rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {user ? getInitials(user.name) : 'А'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{user?.name || 'Пользователь'}</h3>
                    <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
                    {user?.isPro && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fitness-purple/20 text-fitness-purple border border-fitness-purple/30 mt-1">
                        PRO
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
