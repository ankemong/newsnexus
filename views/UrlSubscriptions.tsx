import React, { useState } from 'react';
import { Rss, Plus, Search, ExternalLink, Trash2, Edit2, Check, X, Globe, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UrlSubscription {
  id: string;
  name: string;
  url: string;
  type: 'RSS' | 'Website' | 'API';
  status: 'active' | 'error' | 'checking';
  lastUpdate: string;
  updateCount: number;
  favicon?: string;
}

const UrlSubscriptions: React.FC = () => {
  const { t } = useLanguage();

  const [subscriptions, setSubscriptions] = useState<UrlSubscription[]>([
    {
      id: '1',
      name: 'Hacker News',
      url: 'https://news.ycombinator.com/rss',
      type: 'RSS',
      status: 'active',
      lastUpdate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updateCount: 1247,
      favicon: 'https://news.ycombinator.com/favicon.ico'
    },
    {
      id: '2',
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      type: 'RSS',
      status: 'active',
      lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updateCount: 856,
      favicon: 'https://techcrunch.com/favicon.ico'
    },
    {
      id: '3',
      name: 'Reuters Tech',
      url: 'https://www.reuters.com/world/india/tech/',
      type: 'Website',
      status: 'error',
      lastUpdate: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
      updateCount: 432,
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchUrl, setSearchUrl] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    url: '',
    type: 'RSS' as 'RSS' | 'Website' | 'API'
  });

  // URL搜索功能
  const handleUrlSearch = async () => {
    if (!searchUrl.trim()) return;

    setIsSearching(true);
    try {
      // 模拟URL搜索和分析
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResults = [
        {
          title: '发现RSS源',
          description: '在此URL找到了可用的RSS源',
          url: searchUrl + '/rss',
          type: 'RSS'
        },
        {
          title: '网页内容',
          description: '可以监控此网页的内容更新',
          url: searchUrl,
          type: 'Website'
        }
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 添加订阅
  const handleAddSubscription = (result: any) => {
    const newSub: UrlSubscription = {
      id: Date.now().toString(),
      name: result.title,
      url: result.url,
      type: result.type,
      status: 'checking',
      lastUpdate: new Date().toISOString(),
      updateCount: 0
    };

    setSubscriptions([...subscriptions, newSub]);
    setShowAddModal(false);
    setSearchUrl('');
    setSearchResults([]);

    // 模拟检查状态
    setTimeout(() => {
      setSubscriptions(prev => prev.map(sub =>
        sub.id === newSub.id ? { ...sub, status: 'active' } : sub
      ));
    }, 2000);
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
      case 'checking':
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

    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时前`;
    return `${Math.floor(diffMins / 1440)}天前`;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和添加按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">URL订阅管理</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加订阅
        </button>
      </div>

      {/* 订阅列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">我的订阅源</h3>
          <p className="text-sm text-gray-500 mt-1">管理您的RSS源、网站监控和API接口</p>
        </div>

        <div className="divide-y divide-gray-100">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
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
                        已获取 {subscription.updateCount} 条内容
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubscription(subscription.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加订阅模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* 标题栏 */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">添加URL订阅</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchUrl('');
                  setSearchResults([]);
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
                    输入URL地址
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
                      搜索
                    </button>
                  </div>
                </div>

                {/* 搜索结果 */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">找到以下订阅源：</p>
                    {searchResults.map((result, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{result.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                            <p className="text-xs text-gray-500 truncate">{result.url}</p>
                          </div>
                          <button
                            onClick={() => handleAddSubscription(result)}
                            className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                          >
                            <Plus className="w-3 h-3" />
                            添加
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 无结果提示 */}
                {!isSearching && searchUrl && searchResults.length === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">未找到可用的订阅源，请检查URL是否正确</p>
                  </div>
                )}
              </div>
            </div>

            {/* 快速添加区域 */}
            <div className="p-6">
              <p className="text-sm font-medium text-gray-700 mb-3">或手动添加订阅：</p>
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
                  <option value="RSS">RSS源</option>
                  <option value="Website">网站监控</option>
                  <option value="API">API接口</option>
                </select>
                <button
                  onClick={() => {
                    if (newSubscription.name && newSubscription.url) {
                      handleAddSubscription({
                        title: newSubscription.name,
                        url: newSubscription.url,
                        type: newSubscription.type
                      });
                      setNewSubscription({ name: '', url: '', type: 'RSS' });
                    }
                  }}
                  disabled={!newSubscription.name || !newSubscription.url}
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  添加订阅
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlSubscriptions;