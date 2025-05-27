
import { FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionCards = () => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-5 h-5 text-fitness-blue" />
          <h3 className="text-lg font-semibold text-white">Экспорт отчёта</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Получите подробный отчёт о вашем рационе за выбранный период
        </p>
        <Button className="w-full bg-fitness-blue hover:bg-blue-600 text-white">
          Создать отчёт
        </Button>
      </div>

      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-5 h-5 text-fitness-green" />
          <h3 className="text-lg font-semibold text-white">Нутрициолог</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Свяжитесь с экспертом для персональных рекомендаций
        </p>
        <Button className="w-full bg-fitness-green hover:bg-green-600 text-white">
          Связаться
        </Button>
      </div>
    </div>
  );
};

export default ActionCards;
