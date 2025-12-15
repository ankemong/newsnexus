
import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Share2, MessageSquare, Bot, Search, BarChart2, Bookmark, Globe, BookOpen, X, Maximize2, LayoutGrid, List, MoreHorizontal, Activity } from 'lucide-react';
import { Article, Language } from '../types';
import { summarizeArticleContent, translateArticleText, expandArticleContent } from '../services/geminiService';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Props interface for the Articles component.
 * @property onViewDetail - Callback function to handle article selection for detailed view.
 */
interface ArticlesProps {
  onViewDetail: (article: Article) => void;
}

/**
 * Mock data for initial development and testing.
 * Represents a list of articles with various attributes including sentiment.
 */
const mockArticles: Article[] = [
  {
    id: 'a1',
    title: 'The Future of Quantum Computing in Finance',
    source: 'Tech Daily',
    publishedAt: new Date().toISOString(),
    url: '#',
    language: Language.English,
    category: 'Technology',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    content: 'Quantum computing promises to revolutionize financial modeling by processing vast amounts of data at unprecedented speeds. Major banks are already investing heavily in this technology...',
    sentiment: 'positive'
  },
  {
    id: 'a2',
    title: 'Global Markets React to Energy Crisis',
    source: 'World Econ',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    url: '#',
    language: Language.English,
    category: 'Economy',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    content: 'Energy prices have soared to record highs, causing significant volatility in global stock markets. Manufacturing sectors in Europe are particularly affected...',
    sentiment: 'negative'
  },
  {
    id: 'a3',
    title: 'Avancées médicales majeures en 2024',
    source: 'Le Monde Santé',
    publishedAt: new Date(Date.now() - 12000000).toISOString(),
    url: '#',
    language: Language.French,
    category: 'Health',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    content: "Une nouvelle thérapie génique montre des résultats prometteurs pour le traitement de maladies rares. Les essais cliniques débutent le mois prochain...",
    sentiment: 'positive'
  }
];

/**
 * Articles Component
 * Displays a grid or table of news articles with filtering, searching, and interaction capabilities.
 * Includes AI features like summarization and translation.
 */
const Articles: React.FC<ArticlesProps> = ({ onViewDetail }) => {
  const { t, language } = useLanguage();
  
  // -- Data State --
  const [articles] = useState<Article[]>(mockArticles);
  
  // -- Filter States --
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all'); // Added sentiment filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // -- UI States --
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // -- AI Processing States --
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<Record<string, boolean>>({});
  
  // -- Persistence State --
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Get unique categories for the filter dropdown
  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean))).sort();

  /**
   * Effect: Simulate initial data loading to show skeleton state.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);

    // Load saved articles from local storage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
        try {
            setSavedIds(JSON.parse(saved));
        } catch (e) {
            console.error('Failed to parse saved articles');
        }
    }

    return () => clearTimeout(timer);
  }, []);

  /**
   * Effect: Lock body scroll when the modal detail view is open.
   */
  useEffect(() => {
    if (selectedArticle) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArticle]);

  /**
   * Toggles the saved state of an article in local storage.
   */
  const handleSave = (e: React.MouseEvent, articleId: string) => {
      e.stopPropagation();
      let newSaved;
      if (savedIds.includes(articleId)) {
          newSaved = savedIds.filter(id => id !== articleId);
      } else {
          newSaved = [...savedIds, articleId];
      }
      setSavedIds(newSaved);
      localStorage.setItem('savedArticles', JSON.stringify(newSaved));
  };

  /**
   * Triggers AI summarization for a specific article card.
   * Prevents duplicate requests if already summarized or loading.
   */
  const handleSummarize = async (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    if (summaries[article.id] || loadingSummaries[article.id]) return;

    setLoadingSummaries(prev => ({ ...prev, [article.id]: true }));
    try {
        const result = await summarizeArticleContent(article.content);
        setSummaries(prev => ({ ...prev, [article.id]: result }));
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingSummaries(prev => ({ ...prev, [article.id]: false }));
    }
  };

  /**
   * Triggers AI translation for a specific article card.
   * Toggles back to original text if already translated.
   */
  const handleTranslateListItem = async (e: React.MouseEvent, article: Article) => {
      e.stopPropagation();
      
      // Toggle logic: If translated, remove translation to show original
      if (translations[article.id]) {
          const newTranslations = { ...translations };
          delete newTranslations[article.id];
          setTranslations(newTranslations);
          return;
      }

      if (loadingTranslations[article.id]) return;

      setLoadingTranslations(prev => ({ ...prev, [article.id]: true }));
      try {
          const result = await translateArticleText(article.content, language);
          setTranslations(prev => ({ ...prev, [article.id]: result }));
      } catch (error) {
          console.error(error);
      } finally {
          setLoadingTranslations(prev => ({ ...prev, [article.id]: false }));
      }
  };

  const openDetail = (article: Article) => {
      setSelectedArticle(article);
  };

  /**
   * Filter and sorting logic.
   * Filters by Language, Category, Sentiment, Text Search, and Date Range.
   * Sorts by relevance to search query, then date.
   */
  const filteredArticles = articles.filter(a => {
    // 1. Filter by Language
    const matchesLang = filterLang === 'all' || a.language === filterLang;
    
    // 2. Filter by Category
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    
    // 3. Filter by Sentiment
    const matchesSentiment = filterSentiment === 'all' || a.sentiment === filterSentiment;
    
    // 4. Filter by Search Query (Title, Content, Category)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
        a.title.toLowerCase().includes(query) || 
        a.content.toLowerCase().includes(query) ||
        (a.category && a.category.toLowerCase().includes(query));
    
    // 5. Filter by Date Range
    let matchesDate = true;
    if (startDate || endDate) {
        const articleDate = new Date(a.publishedAt).getTime();
        // Start date: 00:00:00 of selected day
        if (startDate && articleDate < new Date(startDate).setHours(0,0,0,0)) matchesDate = false;
        // End date: 23:59:59 of selected day
        if (endDate && articleDate > new Date(endDate).setHours(23,59,59,999)) matchesDate = false;
    }

    return matchesLang && matchesCategory && matchesSentiment && matchesSearch && matchesDate;
  }).sort((a, b) => {
    // Priority Sort: Search matches in title appear first
    if (!searchQuery) return 0;
    const query = searchQuery.toLowerCase();
    const aTitleMatch = a.title.toLowerCase().includes(query);
    const bTitleMatch = b.title.toLowerCase().includes(query);

    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    return 0;
  });

  return (
    <div className="space-y-6 relative">
      {/* --- Filter & Search Controls --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col xl:flex-row gap-4 items-center justify-between z-10 relative">
        {/* Search Input */}
        <div className="relative w-full xl:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t('articles.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {/* Date Range Picker */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-1 w-full md:w-auto shrink-0">
             <Calendar className="w-4 h-4 text-gray-500 ml-2" />
             <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-gray-700 text-xs focus:ring-0 p-2 outline-none w-28"
                placeholder={t('articles.startDate')}
             />
             <span className="text-gray-400">-</span>
             <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-gray-700 text-xs focus:ring-0 p-2 outline-none w-28"
                placeholder={t('articles.endDate')}
             />
          </div>

          <div className="h-6 w-px bg-gray-200 hidden md:block shrink-0"></div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="flex items-center space-x-2 text-gray-500 mr-2 shrink-0">
               <Filter className="w-5 h-5" />
               <span className="font-medium text-sm hidden lg:inline">{t('articles.filter')}</span>
             </div>
             
             {/* Category Filter */}
             <select 
               value={filterCategory}
               onChange={(e) => setFilterCategory(e.target.value)}
               className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2 outline-none shrink-0 cursor-pointer hover:bg-gray-100 transition-colors"
             >
               <option value="all">All Categories</option>
               {categories.map(cat => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
             </select>

             {/* Sentiment Filter */}
             <select 
               value={filterSentiment}
               onChange={(e) => setFilterSentiment(e.target.value)}
               className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2 outline-none shrink-0 cursor-pointer hover:bg-gray-100 transition-colors"
             >
               <option value="all">{t('articles.allSentiments')}</option>
               <option value="positive">{t('articles.positive')}</option>
               <option value="neutral">{t('articles.neutral')}</option>
               <option value="negative">{t('articles.negative')}</option>
             </select>

             {/* Language Filter */}
             <select 
               value={filterLang}
               onChange={(e) => setFilterLang(e.target.value)}
               className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2 outline-none shrink-0 cursor-pointer hover:bg-gray-100 transition-colors"
             >
               <option value="all">{t('articles.allLangs')}</option>
               {Object.values(Language).map(lang => (
                 <option key={lang} value={lang}>{lang.toUpperCase()}</option>
               ))}
             </select>

             <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block shrink-0"></div>

             {/* View Mode Toggle */}
             <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                 <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                    title="Grid View"
                 >
                     <LayoutGrid className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                    title="Table View"
                 >
                     <List className="w-4 h-4" />
                 </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- Grid View Rendering --- */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
                // Skeleton Loader
                Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col animate-pulse">
                        <div className="h-48 w-full bg-gray-200" />
                        <div className="p-5 flex-1 flex flex-col space-y-4">
                            <div className="flex justify-between">
                                <div className="h-3 w-20 bg-gray-200 rounded" />
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                            </div>
                            <div className="h-6 w-3/4 bg-gray-200 rounded" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-full bg-gray-200 rounded" />
                                <div className="h-3 w-full bg-gray-200 rounded" />
                                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="flex gap-2">
                                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                filteredArticles.map(article => (
                <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full group cursor-pointer" onClick={() => openDetail(article)}>
                    <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale" />
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                        {/* Sentiment Badge */}
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase shadow-sm flex items-center gap-1
                            ${article.sentiment === 'positive' ? 'bg-green-100 text-green-800 border border-green-200' : 
                              article.sentiment === 'negative' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}
                        `}>
                            {article.sentiment === 'positive' ? '↑ ' : article.sentiment === 'negative' ? '↓ ' : '• '}
                            {article.sentiment}
                        </span>
                        {/* Category Badge */}
                        <span className="px-2 py-1 rounded text-xs font-bold uppercase shadow-sm bg-white/90 text-black backdrop-blur-sm">
                            {article.category}
                        </span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-0"></div>

                    {/* Card Actions (Hover) */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <button 
                            onClick={(e) => { e.stopPropagation(); openDetail(article); }}
                            className="p-2 rounded-full bg-white text-black shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={(e) => handleSave(e, article.id)}
                            className={`p-2 rounded-full shadow-lg transition-colors ${savedIds.includes(article.id) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                        >
                            <Bookmark className={`w-4 h-4 ${savedIds.includes(article.id) ? 'fill-white' : ''}`} />
                        </button>
                    </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">{article.source}</span>
                        <span className="text-xs text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 
                        className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                    >
                        {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                        {translations[article.id] ? (
                            <span className="animate-in fade-in">{translations[article.id]}</span>
                        ) : (
                            article.content
                        )}
                    </p>
                    
                    {translations[article.id] && (
                        <div className="mb-2 text-[10px] uppercase font-bold text-blue-600 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Translated by AI
                        </div>
                    )}
                    
                    {summaries[article.id] && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 animate-in fade-in">
                        <div className="flex items-center gap-1 font-semibold mb-1 text-black text-xs uppercase tracking-wider">
                            <Bot className="w-3 h-3" /> {t('articles.summary')}
                        </div>
                        {summaries[article.id]}
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-black group-hover:underline decoration-2 underline-offset-4">
                        {t('articles.readMore')}
                        </span>
                        <div className="flex items-center gap-3">
                        <button 
                            onClick={(e) => handleTranslateListItem(e, article)}
                            disabled={loadingTranslations[article.id]}
                            className={`text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50 ${translations[article.id] ? 'text-blue-600' : 'text-gray-500 hover:text-black'}`}
                            title={translations[article.id] ? t('articles.showOriginal') : t('articles.translate')}
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">{loadingTranslations[article.id] ? t('articles.translating') : (translations[article.id] ? t('articles.showOriginal') : t('articles.translate'))}</span>
                        </button>
                        <button 
                            onClick={(e) => handleSummarize(e, article)}
                            disabled={loadingSummaries[article.id] || !!summaries[article.id]}
                            className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                            <Bot className="w-4 h-4" />
                            <span className="hidden sm:inline">{loadingSummaries[article.id] ? t('articles.processing') : t('articles.summarize')}</span>
                        </button>
                        <Share2 className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer ml-1" onClick={e => e.stopPropagation()} />
                        </div>
                    </div>
                    </div>
                </div>
                ))
            )}
        </div>
      )}

      {/* --- Table View Rendering --- */}
      {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                          <tr>
                              <th className="px-6 py-4">Article</th>
                              <th className="px-6 py-4">Source</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4">Language</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Sentiment</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {isLoading ? (
                                // Table Skeleton
                                Array(6).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 w-32 bg-gray-200 rounded" />
                                        </td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                                        <td className="px-6 py-4 text-right"><div className="h-6 w-24 bg-gray-200 rounded ml-auto" /></td>
                                    </tr>
                                ))
                          ) : (
                              filteredArticles.map(article => (
                              <tr key={article.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openDetail(article)}>
                                  <td className="px-6 py-4">
                                      <div className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-1 max-w-xs transition-colors">
                                          {article.title}
                                      </div>
                                      <div className={`text-xs line-clamp-1 max-w-xs mt-0.5 ${translations[article.id] ? 'text-gray-700 italic' : 'text-gray-500'}`}>
                                          {translations[article.id] || article.content}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="font-medium text-gray-700">{article.source}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">
                                          {article.category}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="uppercase text-xs font-bold text-gray-400">{article.language}</span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                                      {new Date(article.publishedAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                                          ${article.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                                            article.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                                      `}>
                                          {article.sentiment}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                          <button 
                                              onClick={(e) => handleTranslateListItem(e, article)}
                                              className={`p-1.5 rounded transition-colors ${translations[article.id] ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-black hover:bg-gray-100'} ${loadingTranslations[article.id] ? 'opacity-50 cursor-wait' : ''}`}
                                              title={translations[article.id] ? t('articles.showOriginal') : t('articles.translate')}
                                              disabled={loadingTranslations[article.id]}
                                          >
                                              <Globe className="w-4 h-4" />
                                          </button>
                                          <button 
                                              onClick={(e) => handleSummarize(e, article)}
                                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                                              title="Summarize"
                                          >
                                              <Bot className="w-4 h-4" />
                                          </button>
                                          <button 
                                              onClick={(e) => handleSave(e, article.id)}
                                              className={`p-1.5 rounded transition-colors ${savedIds.includes(article.id) ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                                              title="Save"
                                          >
                                              <Bookmark className={`w-4 h-4 ${savedIds.includes(article.id) ? 'fill-current' : ''}`} />
                                          </button>
                                          <button 
                                              onClick={() => openDetail(article)}
                                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                                              title="View Details"
                                          >
                                              <Maximize2 className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- Article Detail Modal --- */}
      {selectedArticle && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedArticle(null)}
        >
            <div 
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto custom-scrollbar relative animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>
                <ArticleDetail 
                    article={selectedArticle} 
                    onBack={() => setSelectedArticle(null)} 
                    isModal={true} 
                />
            </div>
        </div>
      )}
    </div>
  );
};

/**
 * ArticleDetail Component
 * Displays full content of an article including big header image, AI summary, and full text.
 * Can be used as a standalone page or inside a modal.
 */
export const ArticleDetail: React.FC<{ article: Article; onBack: () => void; isModal?: boolean }> = ({ article, onBack, isModal = false }) => {
  const { t, language } = useLanguage();
  
  // -- Local States --
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  // Check saved state on mount and reset ephemeral states
  useEffect(() => {
      const saved = localStorage.getItem('savedArticles');
      if (saved) {
          const ids = JSON.parse(saved);
          setIsSaved(ids.includes(article.id));
      }
      // Reset states when article changes
      setTranslatedContent(null);
      setShowTranslated(false);
      setExpandedContent(null);
      setSummary(null);
  }, [article.id]);

  const toggleSave = () => {
      const saved = localStorage.getItem('savedArticles');
      let ids = saved ? JSON.parse(saved) : [];
      
      if (isSaved) {
          ids = ids.filter((id: string) => id !== article.id);
      } else {
          ids.push(article.id);
      }
      localStorage.setItem('savedArticles', JSON.stringify(ids));
      setIsSaved(!isSaved);
  };

  /**
   * Generates a 3-bullet summary using Gemini Service.
   */
  const handleSummarize = async () => {
    if (!article.content) return;
    setLoadingSummary(true);
    // Use expanded content if available for better summary context
    const textToSummarize = expandedContent || article.content;
    const result = await summarizeArticleContent(textToSummarize);
    setSummary(result);
    setLoadingSummary(false);
  };

  /**
   * Translates the displayed content using Gemini Service.
   */
  const handleTranslate = async () => {
      if (showTranslated) {
          setShowTranslated(false);
          return;
      }

      const textToTranslate = expandedContent || article.content;

      // If translation exists and we aren't generating new content, just show it
      if (translatedContent && !isExpanding) { 
          setShowTranslated(true);
          return;
      }

      setIsTranslating(true);
      const result = await translateArticleText(textToTranslate, language);
      setTranslatedContent(result);
      setIsTranslating(false);
      setShowTranslated(true);
  };

  /**
   * Expands a short snippet into a full article using Gemini generative capabilities.
   */
  const handleExpand = async () => {
    setIsExpanding(true);
    try {
        const result = await expandArticleContent(article.title, article.content, article.language);
        setExpandedContent(result);
        
        // Reset translation since base content changed
        setTranslatedContent(null);
        setShowTranslated(false);
    } catch (e) {
        console.error("Failed to expand content", e);
    } finally {
        setIsExpanding(false);
    }
  };

  const trendData = [
      { name: '1h', val: 10 }, { name: '2h', val: 25 }, { name: '3h', val: 40 }, { name: '4h', val: 35 }, { name: '5h', val: 55 }
  ];

  return (
    <div className={isModal ? "bg-white min-h-full" : "max-w-4xl mx-auto space-y-6"}>
        {!isModal && (
            <div className="flex justify-between items-center mb-2">
                <button 
                onClick={onBack}
                className="text-gray-500 hover:text-black flex items-center gap-2 font-medium"
                >
                ← {t('articles.back')}
                </button>
                <button 
                    onClick={toggleSave}
                    className={`p-2 rounded-full border transition-all flex items-center gap-2 px-4 text-sm font-medium ${isSaved ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    {isSaved ? 'Saved' : 'Save Article'}
                </button>
            </div>
        )}

        <div className={`bg-white ${isModal ? '' : 'rounded-xl shadow-sm border border-gray-200'} overflow-hidden`}>
        {/* Header Image & Title */}
        <div className="h-72 w-full relative group">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-4 mb-3 text-white/90 text-sm font-medium tracking-wide">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 uppercase text-xs">
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{article.source}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white shadow-black leading-tight">{article.title}</h1>
            </div>

            {/* In Modal, Save button is over image if no top bar */}
            {isModal && (
                 <div className="absolute top-4 left-4 z-20">
                     <button 
                        onClick={toggleSave}
                        className={`p-2 rounded-full backdrop-blur-md border transition-all flex items-center gap-2 px-4 text-sm font-bold shadow-lg ${isSaved ? 'bg-black/80 text-white border-black/50' : 'bg-white/80 text-black border-white/50 hover:bg-white'}`}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                 </div>
            )}
        </div>
        
        <div className="p-8 md:p-10">
            {/* AI Control Center */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-black" />
                            <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">{t('articles.summary')}</h3>
                        </div>
                        
                        <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
                        
                        <button 
                            onClick={handleExpand}
                            disabled={isExpanding || !!expandedContent}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors disabled:opacity-50 group"
                        >
                            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {isExpanding ? t('articles.generating') : t('articles.readFull')}
                        </button>

                        <div className="h-4 w-px bg-gray-300 hidden md:block"></div>

                        <button 
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors disabled:opacity-50 group"
                        >
                            <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {isTranslating ? t('articles.translating') : showTranslated ? t('articles.showOriginal') : t('articles.translate')}
                        </button>
                    </div>

                    {!summary && (
                    <button 
                        onClick={handleSummarize}
                        disabled={loadingSummary}
                        className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
                    >
                        {loadingSummary ? t('articles.processing') : t('articles.summarize')}
                    </button>
                    )}
                </div>
                
                {summary && (
                    <div className="prose prose-sm text-gray-700 animate-in fade-in slide-in-from-top-2 bg-white p-4 rounded-lg border border-gray-100">
                        <div className="whitespace-pre-wrap leading-relaxed">{summary}</div>
                    </div>
                )}
                {!summary && !loadingSummary && (
                    <p className="text-sm text-gray-500 pl-1">Get a quick AI-powered overview of this content before reading.</p>
                )}
            </div>

            {/* Main Content Area */}
            <div className="prose max-w-none text-gray-800 leading-relaxed font-serif text-lg">
                <div className="animate-in fade-in duration-700 whitespace-pre-wrap">
                    {showTranslated && translatedContent 
                        ? translatedContent 
                        : (expandedContent || article.content)}
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm text-gray-400 italic border-t pt-4">
                     <Bot className="w-4 h-4" />
                     {showTranslated 
                        ? 'Translated by AI.' 
                        : (expandedContent ? 'Full content generated by AI.' : 'Original Content.')}
                </div>
            </div>

            {/* Metrics & Recommendations */}
            <div className="mt-12 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-10">
               {/* Trend Chart */}
               <div>
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                     <BarChart2 className="w-4 h-4 text-black" />
                     {t('articles.popularity')} (Last 5h)
                  </h4>
                  <div className="h-40 bg-gray-50 rounded-xl p-4 border border-gray-100">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                            <XAxis dataKey="name" hide />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="val" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Similar Articles */}
               <div>
                    <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">{t('articles.similar')}</h4>
                    <div className="space-y-3">
                        <div className="p-4 border border-gray-100 rounded-xl hover:border-black cursor-pointer transition-colors bg-gray-50 group">
                            <h5 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">Related Topic A</h5>
                            <p className="text-xs text-gray-500 mt-1">98% match • Reuters</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-xl hover:border-black cursor-pointer transition-colors bg-gray-50 group">
                            <h5 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">Related Topic B</h5>
                            <p className="text-xs text-gray-500 mt-1">85% match • CNN</p>
                        </div>
                    </div>
               </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Articles;
