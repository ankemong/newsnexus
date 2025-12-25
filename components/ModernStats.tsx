import React from 'react';
import { Newspaper, Rss, Clock, Users, ArrowUp, ArrowDown } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, change, color }) => {
  const isPositive = !change.startsWith('-');

  return (
    <div className="flex items-center p-4 bg-white bg-opacity-5 rounded-lg">
      <div className={`p-3 rounded-full mr-4 rtl:ml-4 rtl:mr-0`} style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}40` }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`ml-auto rtl:mr-auto rtl:ml-0 text-sm font-semibold flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        <span>{change.replace('-', '')}</span>
      </div>
    </div>
  );
};

interface ModernStatsProps {
  stats: {
    totalArticles: number;
    weeklyChange: {
      articles: number;
      crawlers: number;
      processingTime: number;
      readership: number;
    };
    activeCrawlers: number;
    avgProcessingTime: number;
    readership: number;
  } | null;
  t: (key: string) => string;
}

const ModernStats: React.FC<ModernStatsProps> = ({ stats, t }) => {
  const statItems = [
    {
      icon: Newspaper,
      label: t('dashboard.totalArticles'),
      value: stats?.totalArticles.toLocaleString() || '0',
      change: `${stats?.weeklyChange.articles || 0}%`,
      color: '#3b82f6',
    },
    {
      icon: Rss,
      label: t('dashboard.activeCrawlers'),
      value: stats?.activeCrawlers.toString() || '0',
      change: `${stats?.weeklyChange.crawlers || 0}`,
      color: '#8b5cf6',
    },
    {
      icon: Clock,
      label: t('dashboard.avgTime'),
      value: stats ? `${stats.avgProcessingTime.toFixed(1)}s` : '0s',
      change: `${stats?.weeklyChange.processingTime || 0}s`,
      color: '#10b981',
    },
    {
      icon: Users,
      label: t('dashboard.readership'),
      value: stats?.readership > 1000 ? `${(stats.readership / 1000).toFixed(1)}k` : stats?.readership.toString() || '0',
      change: `${stats?.weeklyChange.readership || 0}%`,
      color: '#f97316',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-2xl border border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <StatItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ModernStats;

