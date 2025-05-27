
import { FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ActionCards = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Симуляция генерации отчёта
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Отчёт готов!",
        description: "Ваш отчёт о рационе успешно создан и готов к скачиванию.",
      });
    }, 2000);
  };

  const handleContactNutritionist = () => {
    toast({
      title: "Функция в разработке",
      description: "Скоро вы сможете связаться с нашими экспертами напрямую!",
    });
  };

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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-fitness-blue hover:bg-blue-600 text-white">
              Создать отчёт
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Создать отчёт о рационе</DialogTitle>
              <DialogDescription className="text-gray-400">
                Выберите период для создания детального отчёта о вашем питании
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  За неделю
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  За месяц
                </Button>
              </div>
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full bg-fitness-blue hover:bg-blue-600 text-white"
              >
                {isGenerating ? "Создаём отчёт..." : "Создать отчёт"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-5 h-5 text-fitness-green" />
          <h3 className="text-lg font-semibold text-white">Нутрициолог</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Свяжитесь с экспертом для персональных рекомендаций
        </p>
        <Button 
          onClick={handleContactNutritionist}
          className="w-full bg-fitness-green hover:bg-green-600 text-white"
        >
          Связаться
        </Button>
      </div>
    </div>
  );
};

export default ActionCards;
