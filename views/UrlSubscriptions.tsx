import React, { useState } from 'react';
import { Globe, Plus, Search, ExternalLink, Trash2, Edit2, Check, X, Clock, AlertCircle, RefreshCw, FileText, Download, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { WebsiteCrawlerService, CrawledContent } from '../services/websiteCrawlerService';

interface UrlSubscription {
  id: string;
  name: string;
  url: string;
  type: 'RSS' | 'Website' | 'API';
  status: 'active' | 'error' | 'crawling';
  lastUpdate: string;
  updateCount: number;
  crawledContents: CrawledContent[];
  favicon?: string;
}

const UrlSubscriptions: React.FC = () => {
  const { t } = useLanguage();
  const [crawlerService] = useState(() => new WebsiteCrawlerService());
  const [subscriptions, setSubscriptions] = useState<UrlSubscription[]>([
    {
      id: '1',
      name: 'Hacker News',
      url: 'https://news.ycombinator.com',
      type: 'Website',
      status: 'active',
      lastUpdate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updateCount: 1247,
      crawledContents: [
        {
          id: '1-1',
          title: 'The Future of Web Development',
          url: 'https://news.ycombinator.com/item?id=1',
          content: 'Discussion about modern web development trends including React, Vue, and new frameworks...',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          crawledAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        }
      ],
      favicon: 'https://news.ycombinator.com/favicon.ico'
    },
    {
      id: '2',
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      type: 'Website',
      status: 'active',
      lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updateCount: 856,
      crawledContents: [],
      favicon: 'https://techcrunch.com/favicon.ico'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchUrl, setSearchUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCrawling, setIsCrawling] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<CrawledContent | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    url: '',
    type: 'Website' as 'RSS' | 'Website' | 'API'
  });

  // URL搜索和分析功能
  const handleUrlSearch = async () => {
    if (!searchUrl.trim()) return;

    setIsSearching(true);
    try {
      // 检查网站是否支持爬取
      const supportCheck = await crawlerService.checkWebsiteSupport(searchUrl);

      if (supportCheck.supported) {
        console.log(`网站 ${searchUrl} 支持爬取，建议类型: ${supportCheck.suggestedType}`);

        setNewSubscription({
          name: new URL(searchUrl).hostname.replace('www.', ''),
          url: searchUrl,
          type: supportCheck.suggestedType as 'RSS' | 'Website' | 'API'
        });
      } else {
        console.warn(`网站 ${searchUrl} 不支持爬取: ${supportCheck.reason}`);
        // 仍然允许添加，但标记为可能有问题
        setNewSubscription({
          name: new URL(searchUrl).hostname.replace('www.', ''),
          url: searchUrl,
          type: 'Website'
        });
      }
    } catch (error) {
      console.error('URL分析失败:', error);
      // 如果分析失败，仍然允许用户手动添加
      try {
        setNewSubscription({
          name: new URL(searchUrl).hostname.replace('www.', ''),
          url: searchUrl,
          type: 'Website'
        });
      } catch (e) {
        console.error('URL格式错误:', e);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // 爬取网站内容
  const handleCrawlContent = async (subscriptionId: string) => {
    setIsCrawling(subscriptionId);

    // 更新状态为爬取中
    setSubscriptions(prev => prev.map(sub =>
      sub.id === subscriptionId ? { ...sub, status: 'crawling' } : sub
    ));

    try {
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      if (!subscription) {
        throw new Error('订阅不存在');
      }

      console.log(`开始爬取 ${subscription.name} (${subscription.url}) 的内容...`);

      // 使用真实的爬取服务
      const crawlResult = await crawlerService.crawlWebsite(subscription.url, {
        timeRange: 'oneMonth', // 过去30天
        maxArticles: 20,        // 最多爬取20篇文章
        includeImages: false
      });

      if (crawlResult.success && crawlResult.contents.length > 0) {
        console.log(`成功爬取 ${crawlResult.contents.length} 篇文章`);

        // 更新订阅内容
        setSubscriptions(prev => prev.map(sub => {
          if (sub.id === subscriptionId) {
            // 避免重复URL的内容
            const existingUrls = new Set(sub.crawledContents.map(content => content.url));
            const newContents = crawlResult.contents.filter(content => !existingUrls.has(content.url));

            return {
              ...sub,
              status: 'active',
              lastUpdate: new Date().toISOString(),
              updateCount: sub.updateCount + newContents.length,
              crawledContents: [...newContents, ...sub.crawledContents].slice(0, 100) // 限制最多100条
            };
          }
          return sub;
        }));
      } else {
        console.warn('爬取完成但没有获取到内容:', crawlResult.error);
        // 即使没有新内容，也更新状态为活跃
        setSubscriptions(prev => prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'active' } : sub
        ));
      }

    } catch (error) {
      console.error('爬取失败:', error);
      setSubscriptions(prev => prev.map(sub =>
        sub.id === subscriptionId ? { ...sub, status: 'error' } : sub
      ));
    } finally {
      setIsCrawling(null);
    }
  };

  // 预览文章内容
  const handlePreviewArticle = async (article: CrawledContent) => {
    setIsLoadingArticle(true);
    setPreviewArticle(article);

    try {
      // 尝试获取更详细的文章内容
      const detailedContent = await crawlerService.getArticleContent(article.url);

      // 更新文章内容
      setPreviewArticle(prev => prev ? {
        ...prev,
        content: detailedContent
      } : null);
    } catch (error) {
      console.error('获取文章详细内容失败:', error);
      // 如果获取失败，保持原有内容
    } finally {
      setIsLoadingArticle(false);
    }
  };

  // 添加订阅
  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.url) return;

    const newSub: UrlSubscription = {
      id: Date.now().toString(),
      name: newSubscription.name,
      url: newSubscription.url,
      type: newSubscription.type,
      status: 'active',
      lastUpdate: new Date().toISOString(),
      updateCount: 0,
      crawledContents: []
    };

    setSubscriptions([newSub, ...subscriptions]);
    setShowAddModal(false);
    setSearchUrl('');
    setNewSubscription({ name: '', url: '', type: 'Website' });

    // 自动开始爬取
    setTimeout(() => handleCrawlContent(newSub.id), 1000);
  };

  // 删除订阅
  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'crawling':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} ${t('subscriptions.minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('subscriptions.hoursAgo')}`;
    if (diffDays < 30) return `${diffDays} ${t('subscriptions.daysAgo')}`;
    return date.toLocaleDateString();
  };

  // 下载内容
  const handleDownloadContent = (subscription: UrlSubscription, format: 'json' | 'csv' | 'txt') => {
    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
      content = JSON.stringify({
        subscription: {
          name: subscription.name,
          url: subscription.url,
          type: subscription.type,
          lastUpdate: subscription.lastUpdate,
          totalContents: subscription.crawledContents.length
        },
        contents: subscription.crawledContents
      }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      const headers = 'Title,URL,Content,Published At,Crawled At\n';
      const rows = subscription.crawledContents.map(content =>
        `"${content.title}","${content.url}","${content.content}","${content.publishedAt}","${content.crawledAt}"`
      ).join('\n');
      content = headers + rows;
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      const header = `订阅源: ${subscription.name}\nURL: ${subscription.url}\n爬取时间: ${new Date().toLocaleString()}\n总内容数: ${subscription.crawledContents.length}\n\n`;
      const articles = subscription.crawledContents.map((content, index) =>
        `--- 文章 ${index + 1} ---\n标题: ${content.title}\n链接: ${content.url}\n发布时间: ${new Date(content.publishedAt).toLocaleString()}\n内容摘要:\n${content.content}\n`
      ).join('\n\n');
      content = header + articles;
      mimeType = 'text/plain';
      extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${subscription.name}-crawl-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和添加按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('subscriptions.title')}</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('subscriptions.addUrl')}
        </button>
      </div>

      {/* 订阅列表 */}
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* 网站图标 */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {subscription.favicon ? (
                      <img src={subscription.favicon} alt="" className="w-8 h-8 rounded" />
                    ) : (
                      <Globe className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* 订阅信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">{subscription.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        subscription.type === 'RSS' ? 'bg-blue-100 text-blue-700' :
                        subscription.type === 'Website' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {subscription.type}
                      </span>
                      {getStatusIcon(subscription.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <a
                        href={subscription.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 truncate max-w-xs"
                      >
                        {subscription.url}
                      </a>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {t('subscriptions.updatedAt')} {formatTime(subscription.lastUpdate)}
                      </div>
                      <div>
                        {subscription.crawledContents.length} {t('subscriptions.crawledCount')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleCrawlContent(subscription.id)}
                    disabled={isCrawling === subscription.id}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                  >
                    {isCrawling === subscription.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {t('subscriptions.crawling')}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        {t('subscriptions.crawlContent')}
                      </>
                    )}
                  </button>

                  {subscription.crawledContents.length > 0 && (
                    <div className="relative">
                      <button
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                        }}
                      >
                        <Download className="w-4 h-4" />
                        {t('subscriptions.download')}
                      </button>
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 hidden">
                        <button
                          onClick={() => handleDownloadContent(subscription, 'json')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          {t('subscriptions.formats.json')}
                        </button>
                        <button
                          onClick={() => handleDownloadContent(subscription, 'csv')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          {t('subscriptions.formats.csv')}
                        </button>
                        <button
                          onClick={() => handleDownloadContent(subscription, 'txt')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          {t('subscriptions.formats.txt')}
                        </button>
                      </div>
                    </div>
                  )}

                  <a
                    href={subscription.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteSubscription(subscription.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 爬取的内容列表 */}
              {subscription.crawledContents.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">{t('subscriptions.recentContent')}</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subscription.crawledContents.slice(0, 5).map((content) => (
                      <div key={content.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h6 className="text-sm font-medium text-gray-900 truncate mb-1">{content.title}</h6>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1">{content.content}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{t('subscriptions.published')} {formatTime(content.publishedAt)}</span>
                            <button
                              onClick={() => handlePreviewArticle(content)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              {t('subscriptions.preview')}
                            </button>
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {t('subscriptions.viewOriginal')}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                    {subscription.crawledContents.length > 5 && (
                      <div className="text-center text-xs text-gray-500 pt-2">
                        {t('subscriptions.moreContent', { count: subscription.crawledContents.length - 5 })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 添加URL模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* 标题栏 */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">{t('subscriptions.addUrlModalTitle')}</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchUrl('');
                  setNewSubscription({ name: '', url: '', type: 'Website' });
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 搜索区域 */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('subscriptions.enterUrl')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={searchUrl}
                      onChange={(e) => setSearchUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                    <button
                      onClick={handleUrlSearch}
                      disabled={isSearching || !searchUrl.trim()}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      {t('subscriptions.analyzeUrl')}
                    </button>
                  </div>
                </div>

                {/* 手动添加区域 */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newSubscription.name}
                    onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                    placeholder={t('subscriptions.subscriptionName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <input
                    type="url"
                    value={newSubscription.url}
                    onChange={(e) => setNewSubscription({...newSubscription, url: e.target.value})}
                    placeholder={t('subscriptions.urlAddress')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <select
                    value={newSubscription.type}
                    onChange={(e) => setNewSubscription({...newSubscription, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  >
                    <option value="Website">{t('subscriptions.websiteCrawl')}</option>
                    <option value="RSS">{t('subscriptions.rssFeed')}</option>
                    <option value="API">{t('subscriptions.apiInterface')}</option>
                  </select>
                  <button
                    onClick={handleAddSubscription}
                    disabled={!newSubscription.name || !newSubscription.url}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('subscriptions.addAndStart')}
                  </button>
                </div>
              </div>
            </div>

            {/* 功能说明 */}
            <div className="p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">{t('subscriptions.featureDesc')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('subscriptions.featureDesc1')}</li>
                <li>• {t('subscriptions.featureDesc2')}</li>
                <li>• {t('subscriptions.featureDesc3')}</li>
                <li>• {t('subscriptions.featureDesc4')}</li>
                <li>• {t('subscriptions.featureDesc5')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 文章预览模态框 */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* 模态框头部 */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase">
                    {t('subscriptions.articlePreview')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(previewArticle.publishedAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2">
                  {previewArticle.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {previewArticle.author && (
                    <span>{t('subscriptions.author')} {previewArticle.author}</span>
                  )}
                  <span>{t('subscriptions.crawlTime')} {new Date(previewArticle.crawledAt).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingArticle ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('subscriptions.loadingArticle')}</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="space-y-4">
                    {/* 文章摘要 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('subscriptions.articleSummary')}</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {previewArticle.content}
                      </p>
                    </div>

                    {/* 文章信息 */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('subscriptions.articleInfo')}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>{t('subscriptions.publishedTime')}</strong> {new Date(previewArticle.publishedAt).toLocaleString()}
                        </div>
                        <div>
                          <strong>{t('subscriptions.crawlTimeLabel')}</strong> {new Date(previewArticle.crawledAt).toLocaleString()}
                        </div>
                        <div>
                          <strong>{t('subscriptions.articleLink')}</strong>
                          <a
                            href={previewArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 ml-1"
                          >
                            {previewArticle.url}
                          </a>
                        </div>
                        {previewArticle.wordCount && (
                          <div>
                            <strong>{t('subscriptions.wordCount')}</strong> {previewArticle.wordCount} {t('subscriptions.words')}
                          </div>
                        )}
                      </div>
                      {previewArticle.tags && previewArticle.tags.length > 0 && (
                        <div className="mt-3">
                          <strong>{t('subscriptions.tags')}</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {previewArticle.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <a
                        href={previewArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t('subscriptions.visitOriginal')}
                      </a>
                      <button
                        onClick={() => setPreviewArticle(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {t('subscriptions.closePreview')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlSubscriptions;