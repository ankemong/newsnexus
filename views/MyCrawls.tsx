
import React from 'react';
import { Calendar, ArrowRight, Search, Database } from 'lucide-react';
import { Article } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MyCrawlsProps {
  articles: Article[];
  onViewDetail: (article: Article) => void;
}

const MyCrawls: React.FC<MyCrawlsProps> = ({ articles, onViewDetail }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('myCrawls.title')}</h2>
          <div className="text-sm text-gray-500">
            {articles.length} {t('crawler.articlesCol')}
          </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <p className="text-gray-600 mb-4">{t('myCrawls.desc')}</p>
         
         {articles.length > 0 ? (
            <div className="grid gap-4">
                {articles.map((article) => (
                    <div key={article.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded uppercase tracking-wider">{article.language}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h4 
                          className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => onViewDetail(article)}
                        >
                            {article.title}
                        </h4>
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {article.content}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-xs font-semibold text-gray-500">{t('myCrawls.source')}: {article.source}</span>
                            <button 
                                onClick={() => onViewDetail(article)}
                                className="text-sm font-medium text-black flex items-center gap-1 hover:underline"
                            >
                                {t('articles.readMore')} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
         ) : (
             <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                 <Database className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-lg font-medium text-gray-500">{t('myCrawls.noData')}</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default MyCrawls;
