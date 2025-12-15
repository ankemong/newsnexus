

import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Rss, 
  Newspaper, 
  PieChart, 
  CreditCard,
  LogOut,
  User,
  Bell,
  Database
} from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen, onLogout }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'crawler', label: t('nav.crawler'), icon: Globe },
    { id: 'subscriptions', label: t('nav.subscriptions'), icon: Rss },
    { id: 'articles', label: t('nav.articles'), icon: Newspaper },
    { id: 'my-crawls', label: t('nav.myCrawls'), icon: Database },
    { id: 'analytics', label: t('nav.analytics'), icon: PieChart },
  ];

  const accountItems = [
    { id: 'notifications', label: t('nav.notifications'), icon: Bell },
    { id: 'profile', label: t('nav.profile'), icon: User },
    { id: 'payment', label: t('nav.payment'), icon: CreditCard },
  ];

  const handleNav = (view: ViewState) => {
    setView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-black text-gray-300 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 flex flex-col border-r border-gray-800
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2 text-white font-bold text-xl cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <span>NewsNexus</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</h3>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNav(item.id as ViewState)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                        ${isActive ? 'bg-white text-black' : 'hover:bg-gray-900 hover:text-white'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Settings</h3>
            <ul className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNav(item.id as ViewState)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                        ${isActive ? 'bg-white text-black' : 'hover:bg-gray-900 hover:text-white'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 text-gray-400 hover:text-white w-full px-2 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
