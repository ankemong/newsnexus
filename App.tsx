
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Crawler from './views/Crawler';
import Subscriptions from './views/Subscriptions';
import Articles, { ArticleDetail } from './views/Articles';
import MyCrawls from './views/MyCrawls';
import Notifications from './views/Notifications';
import Analytics from './views/Analytics';
import Profile from './views/Profile';
import Auth from './views/Auth';
import Pricing from './views/Pricing';
import InfoPage from './views/InfoPage';
import { ViewState, Article } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthService } from './services/authService';

// 错误边界组件
class ErrorBoundary extends React.Component {
  // @ts-ignore
  state: {
    hasError: boolean;
    error?: Error;
  };

  constructor(props: any) {
    super(props);
    // @ts-ignore
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('应用渲染错误:', error, errorInfo);
  }

  render() {
    // @ts-ignore
    if ((this.state as any).hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">出错了</h2>
            <p className="text-gray-600 mb-4">应用遇到了一个错误</p>
            <button
              onClick={() => {
                // @ts-ignore
                (this as any).setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return (this as any).props.children;
  }
}

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State for user's crawled articles
  const [myCrawledArticles, setMyCrawledArticles] = useState<Article[]>([]);

  const { t } = useLanguage();

  // 处理文章查看详情
  const handleViewArticleDetail = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article-detail');
  };

  // 处理视图导航，包含状态清理
  const handleNavigate = (view: ViewState) => {
    // 如果离开文章详情页，延迟清空选中文章
    if (currentView === 'article-detail' && view !== 'article-detail') {
      setCurrentView(view);
      setTimeout(() => setSelectedArticle(null), 100);
    } else {
      setCurrentView(view);
      // 如果不是进入文章详情页，立即清空
      if (view !== 'article-detail') {
        setSelectedArticle(null);
      }
    }
  };

  const handleCrawlComplete = (articles: Article[]) => {
      setMyCrawledArticles(prev => [...articles, ...prev]);
  };

  // 防护：如果状态不一致，自动修复
  useEffect(() => {
    if (currentView === 'article-detail' && !selectedArticle) {
      console.warn('状态不一致：article-detail 视图但没有选中文章，自动重定向到 articles');
      setCurrentView('articles');
    }
  }, [currentView, selectedArticle]);

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      const user = await AuthService.getCurrentUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    // 监听认证状态变化
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setIsLoggedIn(!!user);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Unauthenticated Views
  if (!isLoggedIn) {
    if (currentView === 'home') {
      return <Home setView={setCurrentView} />;
    }
    if (['docs', 'blog', 'community', 'help', 'privacy', 'terms', 'cookie-policy', 'contact'].includes(currentView)) {
        return <InfoPage view={currentView} setView={setCurrentView} />;
    }
    if (['login', 'register', 'forgot-password', 'reset-password'].includes(currentView)) {
      return <Auth view={currentView} setView={setCurrentView} onLogin={() => {
        setIsLoggedIn(true);
        setCurrentView('dashboard');
      }} />;
    }
    // Default fallback
    return <Home setView={setCurrentView} />;
  }

  // Authenticated Content Switcher
  const renderContent = () => {
    // 防护：如果 article-detail 没有选中文章，显示加载
    if (currentView === 'article-detail' && !selectedArticle) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onCrawlComplete={handleCrawlComplete} />;
      case 'crawler':
        return <Crawler />;
      case 'my-crawls':
        return <MyCrawls articles={myCrawledArticles} onViewDetail={handleViewArticleDetail} />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'articles':
        return <Articles onViewDetail={handleViewArticleDetail} />;
      case 'article-detail':
        return selectedArticle
          ? <ArticleDetail
              article={selectedArticle}
              onBack={() => handleNavigate('articles')}
            />
          : null; // 不会执行到这里，因为有上面的防护
      case 'notifications':
        return <Notifications />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
      case 'payment':
        return <Pricing />;
      default:
        // Handle info pages for logged-in users too if needed, or redirect
        if (['docs', 'blog', 'community', 'help', 'privacy', 'terms', 'cookie-policy', 'contact'].includes(currentView)) {
           return <InfoPage view={currentView} setView={handleNavigate} />;
        }
        return <Dashboard />;
    }
  };

  const getTitle = () => {
    switch(currentView) {
      case 'dashboard': return t('nav.dashboard');
      case 'crawler': return t('nav.crawler');
      case 'my-crawls': return t('nav.myCrawls');
      case 'subscriptions': return t('nav.subscriptions');
      case 'articles': return t('nav.articles');
      case 'article-detail': return t('articles.detail') || 'Article Details';
      case 'notifications': return t('nav.notifications');
      case 'analytics': return t('nav.analytics');
      case 'payment': return t('nav.payment');
      case 'profile': return t('nav.profile');
      default: return 'NewsNexus';
    }
  };

  // If viewing an InfoPage while logged in, render it without Sidebar (Full Screen)
  if (['docs', 'blog', 'community', 'help', 'privacy', 'terms', 'cookie-policy', 'contact'].includes(currentView)) {
      return (
        <LanguageProvider>
           <InfoPage view={currentView} setView={handleNavigate} />
        </LanguageProvider>
      );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar
          currentView={currentView}
          setView={handleNavigate}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          onLogout={async () => {
              const { error } = await AuthService.signOut();
              if (error) {
                console.error('Logout error:', error);
              } else {
                setIsLoggedIn(false);
                setCurrentView('home');
                setSelectedArticle(null);
              }
          }}
        />
      
      <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onMenuClick={() => setIsMobileMenuOpen(true)}
            title={getTitle()}
            onNotificationClick={() => handleNavigate('notifications')}
            onProfileClick={() => handleNavigate('profile')}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
