
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProBlock from './ProBlock';

const ProReports = () => {
  const reportContent = (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-fitness-blue" />
        <span>Расширенные отчёты</span>
      </h3>
      <div className="space-y-4">
        <div className="bg-glass-bg p-4 rounded-lg border border-glass-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Отчёт за месяц</h4>
            <span className="text-xs text-fitness-green">PDF</span>
          </div>
          <p className="text-gray-400 text-sm mb-3">Детальный анализ рациона, рекомендации и прогресс</p>
          <Button size="sm" className="w-full bg-fitness-blue hover:bg-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Скачать отчёт
          </Button>
        </div>
        <div className="bg-glass-bg p-4 rounded-lg border border-glass-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Медицинская справка</h4>
            <span className="text-xs text-fitness-purple">PDF</span>
          </div>
          <p className="text-gray-400 text-sm mb-3">Для предоставления врачу или диетологу</p>
          <Button size="sm" className="w-full bg-fitness-purple hover:bg-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Создать справку
          </Button>
        </div>
        <div className="text-center pt-2">
          <span className="text-xs text-gray-500">Отчёты обновляются автоматически</span>
        </div>
      </div>
    </div>
  );

  return (
    <ProBlock
      title="PRO Отчёты"
      description="Скачать расширенный PDF-отчёт для диетолога или врача с детальной аналитикой"
      icon={<FileText className="w-6 h-6 text-fitness-blue" />}
    >
      {reportContent}
    </ProBlock>
  );
};

export default ProReports;
