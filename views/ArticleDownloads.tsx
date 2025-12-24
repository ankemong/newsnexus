import React, { useState, useEffect } from 'react';
import { Rss, CheckCircle, AlertCircle, RefreshCw, FileText, Eye, X, Clock, ChevronDown, ExternalLink, Download, FileJson, FileSpreadsheet, Search, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BochaService, BochaWebSearchResult } from '../services/bochaService';

const ArticleDownloads: React.FC = () => {
  const { t } = useLanguage();

  const [previewItem, setPreviewItem] = useState<BochaWebSearchResult | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [articles, setArticles] = useState<BochaWebSearchResult[]>([]);
  const [filterTime, setFilterTime] = useState<'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear'>('oneMonth');
  const [error, setError] = useState<string | null>(null);

  // 时间过滤器映射
  const timeFilterOptions = [
    { value: 'oneDay', label: '过去24小时' },
    { value: 'oneWeek', label: '过去7天' },
    { value: 'oneMonth', label: '过去30天' },
    { value: 'oneYear', label: '过去一年' }
  ];

  // 初始化博查服务
  const getBochaService = () => {
    const apiKey = import.meta.env.VITE_BOCHA_API_KEY;
    if (!apiKey) {
      throw new Error('博查API密钥未配置');
    }
    return new BochaService(apiKey);
  };

  // 搜索文章
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const bochaService = getBochaService();
      const result = await bochaService.search(searchQuery, {
        freshness: filterTime,
        summary: true,
        count: 20
      });

      if (result.code === 200 && result.data.webPages.value.length > 0) {
        setArticles(result.data.webPages.value);
      } else {
        setArticles([]);
        setError('未找到相关文章');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setError('搜索失败，请稍后重试');
      setArticles([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 获取文章内容
  const fetchArticleContent = async (url: string) => {
    try {
      // 这里可以实现文章内容抓取逻辑
      // 现在先返回摘要或默认内容
      return "文章内容正在加载中...如需完整内容，请访问原文链接。";
    } catch (error) {
      console.error('获取文章内容失败:', error);
      return "无法获取文章内容";
    }
  };

  // 查看文章详情
  const handleViewArticle = async (article: BochaWebSearchResult) => {
    const content = await fetchArticleContent(article.url);
    setPreviewItem({
      ...article,
      fullContent: content
    });
  };

  // 下载文章
  const handleDownload = (article: BochaWebSearchResult, format: 'json' | 'csv' | 'txt') => {
    let content = '';
    let mimeType = '';
    let extension = '';

    const articleData = {
      title: article.name,
      source: article.siteName,
      url: article.url,
      snippet: article.snippet,
      summary: article.summary || '',
      datePublished: article.datePublished,
      dateLastCrawled: article.dateLastCrawled,
      language: article.language,
      displayUrl: article.displayUrl
    };

    if (format === 'json') {
      content = JSON.stringify(articleData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      const headers = Object.keys(articleData).join(',');
      const values = Object.values(articleData).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      content = `${headers}\n${values}`;
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      content = `标题: ${articleData.title}\n来源: ${articleData.source}\n发布时间: ${articleData.datePublished}\n链接: ${articleData.url}\n\n摘要:\n${articleData.snippet}\n\n详细摘要:\n${articleData.summary}\n\n原文链接: ${articleData.url}`;
      mimeType = 'text/plain';
      extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `article-${article.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadMenuOpen(null);
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  // 键盘事件处理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* 搜索区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">文章搜索与下载</h2>

        <div className="space-y-4">
          {/* 搜索输入框 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入关键词搜索文章..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            {/* 时间过滤器 */}
            <div className="relative">
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value as any)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-3 pl-3 pr-10 rounded-lg focus:ring-2 focus:ring-black outline-none cursor-pointer"
              >
                {timeFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>

            {/* 搜索按钮 */}
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  搜索中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  搜索
                </>
              )}
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* 搜索结果 */}
      {articles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">搜索结果</h3>
            <p className="text-sm text-gray-500 mt-1">找到 {articles.length} 篇相关文章</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {articles.map((article, index) => (
              <div key={`${article.url}-${index}`} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200">
                      {article.siteName}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatTime(article.datePublished)}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                    {article.name}
                  </h4>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {article.summary || article.snippet}
                  </p>

                  {article.language && (
                    <div className="text-xs text-gray-500 mb-2">
                      语言: {article.language.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between transition-all duration-300">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewArticle(article)}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black bg-white border border-gray-300 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      查看
                    </button>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black bg-white border border-gray-300 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      原文
                    </a>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setDownloadMenuOpen(downloadMenuOpen === index ? null : index)}
                      className="flex items-center gap-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      下载
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>
                    {downloadMenuOpen === index && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDownloadMenuOpen(null)} />
                        <div className="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                          <button onClick={() => handleDownload(article, 'json')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <FileJson className="w-4 h-4 text-gray-500" /> JSON
                          </button>
                          <button onClick={() => handleDownload(article, 'csv')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-gray-500" /> CSV
                          </button>
                          <button onClick={() => handleDownload(article, 'txt')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" /> Text
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 文章预览模态框 */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                    {previewItem.siteName}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(previewItem.datePublished).toLocaleString()}</span>
                  {previewItem.language && (
                    <span className="text-xs text-gray-500">({previewItem.language.toUpperCase()})</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2">{previewItem.name}</h3>
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {previewItem.displayUrl}
                </a>
              </div>
              <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto prose prose-sm max-w-none text-gray-700 flex-1">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">摘要</h4>
                  <p className="text-gray-600">{previewItem.snippet}</p>
                </div>

                {previewItem.summary && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">详细摘要</h4>
                    <p className="text-gray-600">{previewItem.summary}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">文章信息</h4>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>发布时间:</strong> {new Date(previewItem.datePublished).toLocaleString()}</div>
                      <div><strong>最后爬取:</strong> {new Date(previewItem.dateLastCrawled).toLocaleString()}</div>
                      <div><strong>语言:</strong> {previewItem.language || '未知'}</div>
                      <div><strong>网站:</strong> {previewItem.siteName}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">操作</h4>
                  <div className="flex gap-3">
                    <a
                      href={previewItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      访问原文
                    </a>
                    <button
                      onClick={() => {
                        handleDownload(previewItem, 'txt');
                        setPreviewItem(null);
                      }}
                      className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-3 h-3" />
                      下载文章
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDownloads;