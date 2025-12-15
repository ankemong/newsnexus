
import React, { useState, useEffect } from 'react';
import { Search, Play, TrendingUp, Calendar, Loader2, Clock, Trash2, Eye, Download, FileJson, FileSpreadsheet, FileText, ChevronDown, ExternalLink, X, Bot, Globe, Layers, Map } from 'lucide-react';
import { Article, Language, LANGUAGE_LABELS } from '../types';
import { crawlNewsByKeyword, expandArticleContent } from '../services/geminiService';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const trendData = [
  { day: 'Mon', mentions: 45 },
  { day: 'Tue', mentions: 52 },
  { day: 'Wed', mentions: 38 },
  { day: 'Thu', mentions: 65 },
  { day: 'Fri', mentions: 48 },
  { day: 'Sat', mentions: 59 },
  { day: 'Sun', mentions: 72 },
];

type RegionKey = 'Global' | 'East Asia' | 'Europe' | 'Americas' | 'Middle East';

const REGION_MAP: Record<RegionKey, Language[]> = {
    'Global': [Language.English, Language.Chinese, Language.Spanish, Language.French, Language.German, Language.Japanese, Language.Arabic],
    'East Asia': [Language.Chinese, Language.TraditionalChinese, Language.Japanese, Language.Korean, Language.Vietnamese],
    'Europe': [Language.English, Language.French, Language.German, Language.Spanish, Language.Italian, Language.Russian],
    'Americas': [Language.English, Language.Spanish, Language.Portuguese],
    'Middle East': [Language.Arabic, Language.Turkish, Language.English]
};

interface SubscriptionTask {
    id: string;
    keyword: string;
    createdAt: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    articles: Article[];
    targetRegions: RegionKey[];
    targetLanguages: Language[];
    progress?: number;
}

const Crawler: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Input State
  const [keyword, setKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('Global');
  
  // Persistent State
  const [tasks, setTasks] = useState<SubscriptionTask[]>(() => {
      try {
          const saved = localStorage.getItem('crawler_tasks_v2');
          return saved ? JSON.parse(saved) : [];
      } catch (e) {
          return [];
      }
  });

  // UI State
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  // Persistence Effect
  useEffect(() => {
      localStorage.setItem('crawler_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Reset expanded content when preview changes
    setExpandedContent(null);
    setIsExpanding(false);
    
    // Auto-expand if article is selected
    if (previewArticle) {
        expandContent(previewArticle);
    }
  }, [previewArticle]);

  const expandContent = async (article: Article) => {
      if (article.content.length > 500) {
          setExpandedContent(article.content);
          return;
      }

      setIsExpanding(true);
      try {
          const fullText = await expandArticleContent(article.title, article.content, article.language);
          setExpandedContent(fullText);
      } catch (e) {
          console.error("Failed to expand content", e);
          setExpandedContent(article.content);
      } finally {
          setIsExpanding(false);
      }
  };

  const handleSubscribe = async () => {
    if (!keyword.trim()) return;
    
    // 1. Create Task Immediately (Optimistic UI)
    const languages = REGION_MAP[selectedRegion];
    const newTaskId = Date.now().toString();
    
    const newTask: SubscriptionTask = {
        id: newTaskId,
        keyword: keyword,
        createdAt: new Date().toISOString(),
        status: 'pending',
        articles: [],
        targetRegions: [selectedRegion],
        targetLanguages: languages,
        progress: 10
    };

    setTasks(prev => [newTask, ...prev]);
    setKeyword('');

    // 2. Trigger Background Process
    processTask(newTask);
  };

  const processTask = async (task: SubscriptionTask) => {
      try {
          // Update status to processing
          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'processing', progress: 30 } : t));
          
          // API Call
          const results = await crawlNewsByKeyword(task.keyword, task.targetLanguages);
          
          // Update status to completed with results
          setTasks(prev => prev.map(t => 
              t.id === task.id 
              ? { ...t, status: 'completed', articles: results, progress: 100 } 
              : t
          ));
      } catch (e) {
          console.error("Task failed", e);
          setTasks(prev => prev.map(t => 
              t.id === task.id 
              ? { ...t, status: 'failed', progress: 0 } 
              : t
          ));
      }
  };

  const handleRetry = (task: SubscriptionTask) => {
      processTask(task);
  };

  const handleDeleteTask = (taskId: string) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleDownload = (article: Article, format: 'json' | 'csv' | 'txt') => {
      let content = '';
      let mimeType = '';
      let extension = '';
      
      const contentToDownload = expandedContent || article.content;

      if (format === 'json') {
          content = JSON.stringify({...article, content: contentToDownload}, null, 2);
          mimeType = 'application/json';
          extension = 'json';
      } else if (format === 'csv') {
          const flatArticle = {
            id: article.id,
            title: article.title,
            source: article.source,
            publishedAt: article.publishedAt,
            url: article.url,
            language: article.language,
            content: contentToDownload
          };
          const headers = Object.keys(flatArticle).join(',');
          const values = Object.values(flatArticle).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
          content = `${headers}\n${values}`;
          mimeType = 'text/csv';
          extension = 'csv';
      } else {
          content = `Title: ${article.title}\nSource: ${article.source}\nDate: ${article.publishedAt}\nURL: ${article.url}\n\nContent:\n${contentToDownload}`;
          mimeType = 'text/plain';
          extension = 'txt';
      }

      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `article-${article.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadMenuOpen(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'completed': return 'bg-green-100 text-green-700 border-green-200';
          case 'failed': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="space-y-8 relative">
      {/* Control Center */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-black" />
                {t('crawler.title')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Configure automated intelligence gathering tasks.</p>
        </div>
        
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Topic / Keyword</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('crawler.inputPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all focus:bg-white"
                        />
                    </div>
                </div>

                <div className="w-full md:w-64">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Target Region</label>
                    <div className="relative">
                        <Map className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value as RegionKey)}
                            className="w-full pl-10 pr-8 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none appearance-none cursor-pointer text-sm font-medium focus:bg-white"
                        >
                            {Object.keys(REGION_MAP).map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>

                <button 
                    onClick={handleSubscribe}
                    disabled={!keyword.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gray-200 hover:shadow-lg active:scale-95"
                >
                    <Play className="w-4 h-4" />
                    {t('crawler.startTracking')}
                </button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
                 {REGION_MAP[selectedRegion].slice(0, 5).map(lang => (
                     <span key={lang} className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                         {LANGUAGE_LABELS[lang].split(' ')[0]}
                     </span>
                 ))}
                 {REGION_MAP[selectedRegion].length > 5 && (
                     <span className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">
                         +{REGION_MAP[selectedRegion].length - 5} more
                     </span>
                 )}
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Task List (Feed) */}
         <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-end px-1">
                <h3 className="font-bold text-gray-800 text-lg">
                    Mission Control
                </h3>
                {tasks.length > 0 && <span className="text-sm font-medium text-gray-500">{tasks.length} Active Tasks</span>}
            </div>
            
            {tasks.length > 0 ? (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                            {/* Task Header */}
                            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-lg font-bold text-gray-900">{task.keyword}</h4>
                                        <div className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border flex items-center gap-1.5 ${getStatusColor(task.status)}`}>
                                            {task.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                                            {task.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            <span className="font-medium text-gray-700">{task.targetRegions.join(', ')}</span>
                                        </div>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{new Date(task.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900 leading-none">{task.articles.length}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Articles Found</div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-100 mx-1"></div>
                                    <button 
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title={t('common.delete')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Task Content / Progress */}
                            {task.status === 'processing' || task.status === 'pending' ? (
                                <div className="p-8 bg-gray-50/50 flex flex-col items-center justify-center">
                                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                                        <div 
                                            className="bg-black h-1.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${task.progress || 5}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium animate-pulse">
                                        {task.status === 'pending' ? 'Initializing agents...' : `Scanning ${task.targetLanguages.length} linguistic regions...`}
                                    </p>
                                </div>
                            ) : task.status === 'failed' ? (
                                <div className="p-6 bg-red-50 text-center">
                                    <p className="text-red-600 text-sm font-medium mb-2">Failed to complete crawl.</p>
                                    <button onClick={() => handleRetry(task)} className="text-xs bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-100 font-bold">Retry</button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {task.articles.length > 0 ? (
                                        task.articles.map(article => (
                                            <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded uppercase">{article.language}</span>
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {new Date(article.publishedAt).toLocaleDateString(language)}
                                                    </span>
                                                </div>
                                                <h5 
                                                  onClick={() => setPreviewArticle(article)}
                                                  className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                                                >
                                                    {article.title}
                                                </h5>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                    {article.content}
                                                </p>
                                                
                                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => setPreviewArticle(article)}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {t('subscriptions.view')}
                                                    </button>
                                                    
                                                    <div className="relative">
                                                        <button 
                                                            onClick={() => setDownloadMenuOpen(downloadMenuOpen === article.id ? null : article.id)}
                                                            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            {t('subscriptions.download')}
                                                            <ChevronDown className="w-3 h-3 opacity-50" />
                                                        </button>
                                                        {downloadMenuOpen === article.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setDownloadMenuOpen(null)} />
                                                                <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                                                    <button onClick={() => handleDownload(article, 'json')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><FileJson className="w-3 h-3 text-gray-400" /> JSON</button>
                                                                    <button onClick={() => handleDownload(article, 'csv')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><FileSpreadsheet className="w-3 h-3 text-gray-400" /> CSV</button>
                                                                    <button onClick={() => handleDownload(article, 'txt')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><FileText className="w-3 h-3 text-gray-400" /> Text</button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors ml-auto">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        SOURCE
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 text-sm italic">
                                            No relevant articles found in the selected regions.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Missions</h3>
                    <p className="max-w-xs text-sm">Configure a topic and region above to start gathering global intelligence.</p>
                </div>
            )}
         </div>

         {/* Analytics Panel */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-black" />
                {t('crawler.trendTitle')}
            </h3>
            <p className="text-sm text-gray-500 mb-6">{t('crawler.trendDesc')}</p>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#64748b', fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="mentions" stroke="#000000" strokeWidth={2.5} dot={{fill: '#000000', r: 3}} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">System Capacity</h4>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">API Quota</span>
                    <span className="text-sm font-bold text-black">84%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                </div>
            </div>
         </div>
      </div>

      {/* Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                     <div className="pr-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-white text-black text-[10px] font-bold uppercase tracking-wide border border-gray-200 shadow-sm">
                                {previewArticle.source}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">{new Date(previewArticle.publishedAt).toLocaleString(language)}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{previewArticle.title}</h3>
                     </div>
                     <button onClick={() => setPreviewArticle(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto prose prose-sm max-w-none text-gray-700 relative">
                     {isExpanding ? (
                         <div className="flex flex-col items-center justify-center py-12 space-y-4">
                             <Loader2 className="w-8 h-8 animate-spin text-black" />
                             <p className="text-sm text-gray-500 font-medium">{t('crawler.retrievingContent')}</p>
                         </div>
                     ) : (
                         <div className="whitespace-pre-wrap leading-relaxed font-serif text-base">
                            {expandedContent || previewArticle.content || "No preview content available."}
                         </div>
                     )}
                     
                     {!isExpanding && !expandedContent && (
                         <div className="mt-8 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                             <Bot className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                             <div className="flex-1">
                                 <p className="text-xs font-bold text-blue-900 mb-1">Snippet View</p>
                                 <p className="text-xs text-blue-700 leading-relaxed">
                                     This content is a preview snippet. The full article content can be retrieved using our AI expansion engine.
                                 </p>
                             </div>
                         </div>
                     )}
                 </div>
                 
                 <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                     <div className="text-xs text-gray-400 font-medium uppercase tracking-wider pl-2">
                         ID: {previewArticle.id}
                     </div>
                     <div className="flex gap-3">
                        <button 
                            onClick={() => setPreviewArticle(null)} 
                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                        <a 
                            href={previewArticle.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            {t('subscriptions.visit')} <ExternalLink className="w-3 h-3" />
                        </a>
                     </div>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Crawler;
