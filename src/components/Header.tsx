
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-glass-bg">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-glass-bg">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-glass-bg">
                <User className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80 bg-gray-900/95 backdrop-blur-lg border-gray-700">
              <SheetHeader>
                <SheetTitle className="text-white text-left">Профиль</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-fitness-blue to-fitness-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">А</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Анна</h3>
                    <p className="text-gray-400 text-sm">anna@example.com</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <Button 
                    variant="ghost" 
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
