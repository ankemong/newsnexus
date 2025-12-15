import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, colorClass }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-gray-900 font-bold flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </span>
        <span className="text-gray-400 ml-2">{t('dashboard.vsLastWeek')}</span>
      </div>
    </div>
  );
};

export default StatCard;