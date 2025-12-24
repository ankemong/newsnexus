import React, { useState } from 'react';
import { Globe, Plus, Search, ExternalLink, Trash2, Edit2, Check, X, Clock, AlertCircle, RefreshCw, FileText, Download, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CrawledContent {
  id: string;
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  crawledAt: string;
}

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
      // 模拟URL分析和发现
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResults = [
        {
          title: '发现网站内容',
          description: '可以爬取此网站的内容更新',
          url: searchUrl,
          type: 'Website'
        }
      ];

      setNewSubscription({
        name: new URL(searchUrl).hostname,
        url: searchUrl,
        type: 'Website'
      });
    } catch (error) {
      console.error('搜索失败:', error);
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
      // 模拟爬取过程
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 生成模拟的爬取内容
      const mockContents: CrawledContent[] = [
        {
          id: `${subscriptionId}-${Date.now()}-1`,
          title: '最新文章标题 1',
          url: `https://example.com/article/1`,
          content: '这是第一篇爬取到的文章内容摘要...',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5天前
          crawledAt: new Date().toISOString()
        },
        {
          id: `${subscriptionId}-${Date.now()}-2`,
          title: '最新文章标题 2',
          url: `https://example.com/article/2`,
          content: '这是第二篇爬取到的文章内容摘要...',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10天前
          crawledAt: new Date().toISOString()
        },
        {
          id: `${subscriptionId}-${Date.now()}-3`,
          title: '最新文章标题 3',
          url: `https://example.com/article/3`,
          content: '这是第三篇爬取到的文章内容摘要...',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20天前
          crawledAt: new Date().toISOString()
        }
      ];

      // 更新订阅内容
      setSubscriptions(prev => prev.map(sub => {
        if (sub.id === subscriptionId) {
          return {
            ...sub,
            status: 'active',
            lastUpdate: new Date().toISOString(),
            updateCount: sub.updateCount + mockContents.length,
            crawledContents: [...mockContents, ...sub.crawledContents].slice(0, 50) // 限制最多50条
          };
        }
        return sub;
      }));

    } catch (error) {
      console.error('爬取失败:', error);
      setSubscriptions(prev => prev.map(sub =>
        sub.id === subscriptionId ? { ...sub, status: 'error' } : sub
      ));
    } finally {
      setIsCrawling(null);
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

    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
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
        <h2 className="text-2xl font-bold text-gray-900">URL内容爬取</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加URL
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
                        更新于 {formatTime(subscription.lastUpdate)}
                      </div>
                      <div>
                        已爬取 {subscription.crawledContents.length} 条内容
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
                        爬取中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        爬取内容
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
                        下载
                      </button>
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 hidden">
                        <button
                          onClick={() => handleDownloadContent(subscription, 'json')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          JSON格式
                        </button>
                        <button
                          onClick={() => handleDownloadContent(subscription, 'csv')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          CSV格式
                        </button>
                        <button
                          onClick={() => handleDownloadContent(subscription, 'txt')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          TXT格式
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
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">最近爬取的内容 (过去30天)</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subscription.crawledContents.slice(0, 5).map((content) => (
                      <div key={content.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h6 className="text-sm font-medium text-gray-900 truncate mb-1">{content.title}</h6>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1">{content.content}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>发布: {formatTime(content.publishedAt)}</span>
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              查看原文
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                    {subscription.crawledContents.length > 5 && (
                      <div className="text-center text-xs text-gray-500 pt-2">
                        还有 {subscription.crawledContents.length - 5} 条内容...
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
              <h3 className="text-xl font-semibold text-gray-900">添加URL进行内容爬取</h3>
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
                    输入网站URL
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
                      分析URL
                    </button>
                  </div>
                </div>

                {/* 手动添加区域 */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newSubscription.name}
                    onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                    placeholder="订阅名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <input
                    type="url"
                    value={newSubscription.url}
                    onChange={(e) => setNewSubscription({...newSubscription, url: e.target.value})}
                    placeholder="URL地址"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <select
                    value={newSubscription.type}
                    onChange={(e) => setNewSubscription({...newSubscription, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  >
                    <option value="Website">网站爬取</option>
                    <option value="RSS">RSS源</option>
                    <option value="API">API接口</option>
                  </select>
                  <button
                    onClick={handleAddSubscription}
                    disabled={!newSubscription.name || !newSubscription.url}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    添加并开始爬取
                  </button>
                </div>
              </div>
            </div>

            {/* 功能说明 */}
            <div className="p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">功能说明</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 输入网站URL后，系统将自动爬取该网站过去30天的内容</li>
                <li>• 支持爬取新闻文章、博客文章、产品更新等内容</li>
                <li>• 爬取完成后，可以下载为JSON、CSV或TXT格式</li>
                <li>• 支持定期更新，获取最新的网站内容</li>
                <li>• 所有内容都包含发布时间和爬取时间信息</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlSubscriptions;