import React, { useState, useEffect } from 'react';
import { Clock, Search, ExternalLink, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchEntry {
  keyword: string;
  timestamp: number;
  processingTime?: number;
  articleCount?: number;
}

const SearchLog: React.FC = () => {
  const { t } = useLanguage();
  const [searchHistory, setSearchHistory] = useState<SearchEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadSearchHistory = () => {
      // 从 localStorage 读取搜索日志
      const searchLog = JSON.parse(localStorage.getItem('newsnexus_search_log') || '[]');
      setSearchHistory(searchLog.slice(-10).reverse()); // 显示最近10次搜索，最新的在前
    };

    loadSearchHistory();
    // 每5秒刷新一次
    const interval = setInterval(loadSearchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return t('common.justNow');
    if (diffMins < 60) return t('common.minutesAgo', { count: diffMins });
    if (diffMins < 1440) return t('common.hoursAgo', { count: Math.floor(diffMins / 60) });
    return date.toLocaleDateString();
  };

  const clearHistory = () => {
    localStorage.removeItem('newsnexus_search_log');
    setSearchHistory([]);
  };

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {t('common.searchHistory')}
        </h3>
        <div className="flex items-center gap-2">
          {searchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title={t('common.clearHistory')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? t('common.collapse') : t('common.expand')}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {searchHistory.map((entry, index) => (
            <div
              key={`${entry.timestamp}-${index}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {entry.keyword}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(entry.timestamp)}
                    {entry.processingTime && ` • ${entry.processingTime.toFixed(1)}s`}
                    {entry.articleCount !== undefined && ` • ${t('common.articleCount', { count: entry.articleCount })}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  // 可以在这里添加重新搜索的逻辑
                  window.location.href = `#search=${encodeURIComponent(entry.keyword)}`;
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title={t('common.searchAgain')}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchLog;