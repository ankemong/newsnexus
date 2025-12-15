


import React, { useState } from 'react';
import { Rss, CheckCircle, AlertCircle, RefreshCw, FileText, Eye, X, Clock, ChevronDown, ExternalLink, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Subscription } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Subscriptions: React.FC = () => {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<number | null>(null);
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Hacker News RSS', url: 'https://news.ycombinator.com/rss', type: 'RSS', status: 'healthy', lastFetch: '10 mins ago' },
    { id: '2', name: 'NYT Tech API', url: 'https://api.nytimes.com/svc/news/v3/content', type: 'API', status: 'error', lastFetch: '1 hour ago' },
  ]);

  // Feed/Updates State
  const [filterSource, setFilterSource] = useState('all');
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

  const filteredUpdates = feedUpdates.filter(item => {
    if (filterSource !== 'all' && item.source !== filterSource) return false;
    return true; 
  });

  const handleSubscribe = () => {
    if (!url) return;
    setIsValidating(true);
    
    setTimeout(() => {
      setIsValidating(false);
      const type = url.includes('rss') || url.includes('xml') ? 'RSS' : url.includes('api') ? 'API' : 'HTML';
      const newSub: Subscription = {
        id: Date.now().toString(),
        name: new URL(url).hostname,
        url: url,
        type: type as any,
        status: 'healthy',
        lastFetch: 'Just now'
      };
      setSubscriptions([newSub, ...subscriptions]);
      setUrl('');
    }, 1500);
  };

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
          const values = Object.values(item).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
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
      {/* Input Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rss className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('subscriptions.title')}</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {t('subscriptions.desc')}
        </p>
        
        <div className="flex max-w-lg mx-auto gap-3">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
          <button 
            className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            title="Preview"
          >
             <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSubscribe}
            disabled={isValidating || !url}
            className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
          >
            {isValidating ? t('subscriptions.verifying') : t('subscriptions.subscribe')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start justify-between">
            <div className="flex items-start gap-4 overflow-hidden">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-mono text-xs font-bold text-gray-800">{sub.type}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{sub.name}</h3>
                <p className="text-xs text-gray-500 truncate mb-2">{sub.url}</p>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center text-xs font-medium ${sub.status === 'healthy' ? 'text-gray-900' : 'text-red-600'}`}>
                    {sub.status === 'healthy' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {sub.status === 'healthy' ? t('subscriptions.healthy').toUpperCase() : t('subscriptions.error').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">• Updated {sub.lastFetch}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
                <button 
                   onClick={() => setShowLogs(true)}
                   className="text-gray-400 hover:text-black p-1" title={t('subscriptions.logs')}
                >
                    <FileText className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-black p-1">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Updates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mt-8">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">{t('subscriptions.feedUpdates')}</h3>
            <div className="flex gap-3">
                 <div className="relative">
                     <select 
                        value={filterSource}
                        onChange={(e) => setFilterSource(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none cursor-pointer"
                     >
                        <option value="all">{t('subscriptions.allSources')}</option>
                        {subscriptions.map(sub => (
                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                     </select>
                     <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
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
        <div className="divide-y divide-gray-100">
            {filteredUpdates.length > 0 ? (
                filteredUpdates.map((item) => (
                    <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                             <div className="flex items-center gap-2">
                                 <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                                     {item.source}
                                 </span>
                                 <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                     {item.title}
                                 </a>
                             </div>
                             <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                                 <Clock className="w-3 h-3" />
                                 {new Date(item.time).toLocaleString()}
                             </div>
                        </div>
                        
                        {/* Actions Toolbar */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100/50">
                             <button 
                                onClick={() => setPreviewItem(item)}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors"
                             >
                                 <Eye className="w-3.5 h-3.5" />
                                 {t('subscriptions.view')}
                             </button>
                             <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors"
                             >
                                 <ExternalLink className="w-3.5 h-3.5" />
                                 {t('subscriptions.visit')}
                             </a>
                             <div className="relative">
                                 <button 
                                    onClick={() => setDownloadMenuOpen(downloadMenuOpen === item.id ? null : item.id)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors"
                                 >
                                     <Download className="w-3.5 h-3.5" />
                                     {t('subscriptions.download')}
                                     <ChevronDown className="w-3 h-3 opacity-50" />
                                 </button>
                                 {downloadMenuOpen === item.id && (
                                     <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDownloadMenuOpen(null)} />
                                        <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                            <button 
                                                onClick={() => handleDownload(item, 'json')}
                                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <FileJson className="w-3 h-3 text-gray-400" /> JSON
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(item, 'csv')}
                                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <FileSpreadsheet className="w-3 h-3 text-gray-400" /> CSV
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(item, 'txt')}
                                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <FileText className="w-3 h-3 text-gray-400" /> Text
                                            </button>
                                        </div>
                                     </>
                                 )}
                             </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center text-gray-500">
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

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">{t('subscriptions.logs')}</h3>
                    <button onClick={() => setShowLogs(false)}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="p-4 overflow-y-auto font-mono text-xs space-y-2 text-gray-600">
                    <div className="text-gray-900 font-bold">[2023-10-27 10:00:01] Success: Fetched 15 items from RSS</div>
                    <div className="text-gray-900 font-bold">[2023-10-27 09:00:00] Success: Parsed XML successfully</div>
                    <div className="text-red-600">[2023-10-26 23:00:00] Error: Timeout waiting for response</div>
                    <div className="text-gray-500">[2023-10-26 22:00:00] Info: Scheduled crawl started</div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;