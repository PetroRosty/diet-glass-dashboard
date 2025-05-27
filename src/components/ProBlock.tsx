
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ProBlockProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  buttonText?: string;
}

const ProBlock = ({ 
  title, 
  description, 
  children, 
  icon,
  buttonText = "Открыть доступ"
}: ProBlockProps) => {
  return (
    <div className="relative glass-card animate-fade-in group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-fitness-purple/20">
      {/* Blurred content */}
      <div className="blur-md brightness-50 select-none pointer-events-none">
        {children}
      </div>
      
      {/* Overlay with PRO content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm rounded-xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {icon || <Lock className="w-6 h-6 text-fitness-purple" />}
            <span className="text-lg font-bold bg-gradient-to-r from-fitness-purple to-fitness-blue bg-clip-text text-transparent">
              {title}
            </span>
          </div>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-fitness-purple/20 border border-fitness-purple/30">
            <Lock className="w-4 h-4 mr-2 text-fitness-purple" />
            <span className="text-sm text-fitness-purple font-medium">Доступно только для PRO</span>
          </div>
          
          <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
            {description}
          </p>
          
          <Button 
            className="bg-gradient-to-r from-fitness-purple to-fitness-blue hover:from-purple-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProBlock;
