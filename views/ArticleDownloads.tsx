

import React, { useState } from 'react';
import { Rss, CheckCircle, AlertCircle, RefreshCw, FileText, Eye, X, Clock, ChevronDown, ExternalLink, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ArticleDownloads: React.FC = () => {
  const { t } = useLanguage();

  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<number | null>(null);
  



  const [filterTime, setFilterTime] = useState('24h');

  // Mock Feed Data with content for preview
  const feedUpdates = [
    { 
        id: 1, 
        source: 'Hacker News RSS', 
        title: 'The state of Engineering Management in 2024', 
        time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), 
        url: 'https://news.ycombinator.com',
        content: "Engineering management is evolving rapidly. Key trends include the rise of AI-assisted coding, the shift back to office for some major tech firms, and a renewed focus on developer productivity metrics..."
    },
    { 
        id: 2, 
        source: 'NYT Tech API', 
        title: 'OpenAI Releases New Safety Guidelines', 
        time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), 
        url: 'https://www.nytimes.com',
        content: "OpenAI has announced a comprehensive set of new safety protocols designed to mitigate risks associated with advanced AI models. These guidelines cover areas such as data privacy, model robustness, and prevention of misuse..."
    },
    { 
        id: 3, 
        source: 'Hacker News RSS', 
        title: 'PostgreSQL 17 Released', 
        time: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), 
        url: 'https://postgresql.org',
        content: "The PostgreSQL Global Development Group has announced the release of PostgreSQL 17, the latest version of the world's most advanced open source database. New features include improved vacuuming, enhanced query parallelism, and more..."
    },
    { 
        id: 4, 
        source: 'NYT Tech API', 
        title: 'Apple Announces Vision Pro Updates', 
        time: new Date(Date.now() - 1000 * 3600 * 5).toISOString(), 
        url: 'https://apple.com',
        content: "Apple today revealed significant software updates for its Vision Pro headset, introducing spatial personas, improved hand tracking, and a wider range of immersive environments for users to explore..."
    },
  ];

  const filteredUpdates = feedUpdates;



  const handleDownload = (item: any, format: 'json' | 'csv' | 'txt') => {
      let content = '';
      let mimeType = '';
      let extension = '';

      if (format === 'json') {
          content = JSON.stringify(item, null, 2);
          mimeType = 'application/json';
          extension = 'json';
      } else if (format === 'csv') {
          const headers = Object.keys(item).join(',');
          const values = Object.values(item).map(v => `\"${String(v).replace(/"/g, '""')}\"`).join(',');
          content = `${headers}\n${values}`;
          mimeType = 'text/csv';
          extension = 'csv';
      } else {
          content = `Title: ${item.title}\nSource: ${item.source}\nTime: ${item.time}\nURL: ${item.url}\n\nContent:\n${item.content}`;
          mimeType = 'text/plain';
          extension = 'txt';
      }

      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `article-${item.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadMenuOpen(null);
  };

  return (
    <div className="space-y-6 relative">




      {/* Feed Updates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mt-8">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">{t('subscriptions.feedUpdates')}</h3>
            <div className="flex gap-3">

                 <div className="relative">
                     <select 
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none cursor-pointer"
                     >
                        <option value="24h">{t('subscriptions.last24h')}</option>
                        <option value="7d">{t('subscriptions.last7d')}</option>
                        <option value="30d">{t('subscriptions.last30d')}</option>
                     </select>
                     <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredUpdates.length > 0 ? (
                filteredUpdates.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200">
                                    {item.source}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {new Date(item.time).toLocaleDateString()}
                                </span>
                            </div>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-3 block">
                                {item.title}
                            </a>
                            <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
                                {item.content}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between transition-all duration-300">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPreviewItem(item)}
                                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black bg-white border border-gray-300 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 shadow-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    {t('subscriptions.view')}
                                </button>
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black bg-white border border-gray-300 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 shadow-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t('subscriptions.visit')}
                                </a>
                            </div>
                            <div className="relative">
                                <button 
                                    onClick={() => setDownloadMenuOpen(downloadMenuOpen === item.id ? null : item.id)}
                                    className="flex items-center gap-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    {t('subscriptions.download')}
                                    <ChevronDown className="w-3 h-3 opacity-70" />
                                </button>
                                {downloadMenuOpen === item.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDownloadMenuOpen(null)} />
                                        <div className="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                            <button onClick={() => handleDownload(item, 'json')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><FileJson className="w-4 h-4 text-gray-500" /> JSON</button>
                                            <button onClick={() => handleDownload(item, 'csv')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-gray-500" /> CSV</button>
                                            <button onClick={() => handleDownload(item, 'txt')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /> Text</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full p-12 text-center text-gray-500">
                    No updates found.
                </div>
            )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200">
                 <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                                {previewItem.source}
                            </span>
                            <span className="text-xs text-gray-500">{new Date(previewItem.time).toLocaleString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-snug">{previewItem.title}</h3>
                     </div>
                     <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
                 </div>
                 <div className="p-6 overflow-y-auto prose prose-sm max-w-none text-gray-700">
                     <p>{previewItem.content || "No preview content available."}</p>
                 </div>
                 <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                     <button 
                        onClick={() => setPreviewItem(null)} 
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                     >
                         {t('common.cancel')}
                     </button>
                     <a 
                        href={previewItem.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                     >
                         {t('subscriptions.visit')} <ExternalLink className="w-3 h-3" />
                     </a>
                 </div>
             </div>
        </div>
      )}


    </div>
  );
};

export default ArticleDownloads;

