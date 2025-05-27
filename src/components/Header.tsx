
import { Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
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
            <a href="#" className="text-white hover:text-fitness-blue transition-colors font-medium">Главная</a>
            <a href="#" className="text-gray-400 hover:text-fitness-blue transition-colors">Дневник</a>
            <a href="#" className="text-gray-400 hover:text-fitness-blue transition-colors">Графики</a>
            <a href="#" className="text-gray-400 hover:text-fitness-blue transition-colors">Профиль</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-glass-bg">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-glass-bg">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-glass-bg">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
