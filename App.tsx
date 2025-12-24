
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import ArticleDownloads from './views/ArticleDownloads';
import UrlSubscriptions from './views/UrlSubscriptions';

import Notifications from './views/Notifications';
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
        <div className="flex items-center justify-center h-screen bg-black text-white font-sans">
          <div className="text-center p-10 rounded-lg bg-gray-900 border border-gray-800 shadow-xl max-w-md mx-auto">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-800 border border-gray-700 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-100 mt-4 mb-2">应用遇到错误</h2>
            <p className="text-gray-400 mb-6">抱歉，程序出现了一个问题，请刷新页面重试。</p>
            <button
              onClick={() => {
                // @ts-ignore
                (this as any).setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-6 py-2 bg-gray-800 text-gray-300 font-medium rounded-md border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500"
            >
              刷新页面
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



  const { t } = useLanguage();

  // 处理文章查看详情（功能已移除，保持空操作以避免导航）
  const handleViewArticleDetail = (_article: Article) => {
    console.info('Article detail view has been disabled.');
  };

  // 处理视图导航，包含状态清理
  const handleNavigate = (view: ViewState) => {
    // 移除的数据分析/新闻文章/爬虫功能直接重定向到 dashboard
    const blockedViews: ViewState[] = ['analytics', 'articles', 'article-detail', 'crawler'];
    const targetView = blockedViews.includes(view) ? 'dashboard' : view;

    // 如果离开文章详情页，延迟清空选中文章
    if (currentView === 'article-detail' && targetView !== 'article-detail') {
      setCurrentView(targetView);
      setTimeout(() => setSelectedArticle(null), 100);
    } else {
      setCurrentView(targetView);
      // 如果不是进入文章详情页，立即清空
      if (targetView !== 'article-detail') {
        setSelectedArticle(null);
      }
    }
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
        return <Dashboard />;

      case 'subscriptions':
        return <UrlSubscriptions />;
      case 'notifications':
        return <Notifications />;
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

      case 'subscriptions': return t('nav.subscriptions');
      case 'notifications': return t('nav.notifications');
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
        <Analytics />
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
