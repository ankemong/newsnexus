

import React, { useState, useEffect } from 'react';
import { Users, Rss, Clock, Newspaper, Search, Play, Loader2, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { crawlNewsByKeyword } from '../services/geminiService';
import { getLocalStats, addArticlesToStats, recordSearchInStats, LocalStatsData } from '../services/localStatsService';
import { Article } from '../types';
import ModernStats from '../components/ModernStats';
import SearchLog from '../components/SearchLog';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { t, language } = useLanguage();

  // Search State
  const [keyword, setKeyword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchProgress, setSearchProgress] = useState(0);

  // Stats State
  const [stats, setStats] = useState<LocalStatsData | null>(null);

  // 获取统计数据
  useEffect(() => {
    const fetchStats = () => {
      const statsData = getLocalStats();
      setStats(statsData);
    };

    // 初始化统计数据
    fetchStats();

    // 每5秒更新一次统计数据（更频繁的本地更新）
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setIsCrawling(true);
    setHasSearched(true);
    setArticles([]);
    setSearchStatus(`正在搜索 "${keyword}"...`);
    setSearchProgress(10);

    const startTime = Date.now();

    try {
        // 模拟搜索进度
        setSearchProgress(30);
        setSearchStatus('连接到 Gemini API...');

        const results = await crawlNewsByKeyword(keyword, [language]);
        const processingTime = (Date.now() - startTime) / 1000;

        setSearchProgress(70);
        setSearchStatus(`找到 ${results.length} 篇相关文章...`);

        // 模拟处理中
        await new Promise(resolve => setTimeout(resolve, 500));

        setSearchProgress(90);
        setArticles(results);

        // 记录到本地统计
        addArticlesToStats(results);
        recordSearchInStats(keyword, processingTime, results.length);

        setSearchProgress(100);
        setSearchStatus(`搜索完成！耗时 ${processingTime.toFixed(1)} 秒，找到 ${results.length} 篇文章`);



        // 3秒后清除状态
        setTimeout(() => {
            setSearchStatus('');
            setSearchProgress(0);
        }, 3000);

    } catch (error) {
        console.error('搜索错误:', error);
        setSearchStatus(`搜索失败: ${error instanceof Error ? error.message : '未知错误'}`);
        setSearchProgress(0);
    } finally {
        setIsCrawling(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Stats Component */}
      <ModernStats stats={stats} t={t} />

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('crawler.title')}</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('crawler.inputPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              disabled={isCrawling}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isCrawling || !keyword.trim()}
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
          >
            {isCrawling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isCrawling ? '搜索中...' : t('crawler.startTracking')}
          </button>
        </div>

        {/* 搜索进度和状态 */}
        {(isCrawling || searchStatus) && (
          <div className="space-y-2">
            {isCrawling && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>
            )}
            {searchStatus && (
              <div className={`text-sm ${isCrawling ? 'text-blue-600' : searchStatus.includes('失败') ? 'text-red-600' : 'text-green-600'}`}>
                {searchStatus}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-gray-800">
                {t('crawler.latestResults')}
            </h3>
            {articles.length > 0 && <span className="text-sm text-gray-500">{articles.length} {t('crawler.results')}</span>}
        </div>

        {articles.length > 0 ? (
            <div className="grid gap-4">
                {articles.map((article) => (
                    <div key={article.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded uppercase tracking-wider">{article.language}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                        </h4>
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {article.content}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-xs font-semibold text-gray-500">{article.source}</span>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black flex items-center gap-1 hover:underline">
                                Read Source <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center text-gray-500 min-h-[300px]">
                {isCrawling ? (
                        <>
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-gray-400" />
                        <p className="text-lg">Searching for articles...</p>
                        </>
                ) : hasSearched ? (
                        <>
                        <Search className="w-16 h-16 mb-4 text-gray-200" />
                        <p className="text-lg">No articles found for "{keyword}"</p>
                        </>
                ) : (
                        <>
                        <Search className="w-16 h-16 mb-4 text-gray-200" />
                        <p className="text-lg">Enter a keyword above to start searching.</p>
                        </>
                )}
            </div>
        )}
      </div>

      {/* Search Log */}
      <SearchLog />
    </div>
  );
};

export default Dashboard;