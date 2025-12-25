
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, User as UserIcon, Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, LANGUAGE_LABELS } from '../types';

interface TopBarProps {
  onMenuClick: () => void;
  title: string;
  onNotificationClick: () => void;
  onProfileClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, title, onNotificationClick, onProfileClick }) => {
  const { t, language: currentLang, setLanguage: setLang } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);

  // Sort languages by label alphabetically (locale-aware)
  // Use LANGUAGE_LABELS keys to avoid showing languages missing labels.
  const sortedLanguages = (Object.keys(LANGUAGE_LABELS) as Language[]).sort((a, b) =>
    LANGUAGE_LABELS[a].localeCompare(LANGUAGE_LABELS[b])
  );

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLangMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isLangMenuOpen) {
        setIsLangMenuOpen(false);
        langButtonRef.current?.focus();
      }
    };

    if (isLangMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLangMenuOpen]);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        
        {/* Language Switcher */}
        <div className="relative" ref={langMenuRef}>
            <button
              ref={langButtonRef}
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black"
              title={t('common.switchLanguage')}
              aria-label={t('common.switchLanguage')}
              aria-expanded={isLangMenuOpen}
              aria-haspopup="menu"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-medium uppercase hidden md:block text-gray-500">
                {currentLang === Language.TraditionalChinese ? 'TC' : currentLang.toUpperCase()}
              </span>
            </button>

            {isLangMenuOpen && (
              <div
                className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 max-h-[400px] overflow-y-auto z-50 scrollbar-hide animate-in fade-in zoom-in-95 duration-100"
                role="menu"
                aria-labelledby="language-button"
              >
                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {t('common.selectLanguage')}
                </div>
                {sortedLanguages.map((lang, index) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLang(lang);
                      setIsLangMenuOpen(false);
                      langButtonRef.current?.focus();
                    }}
                    role="menuitem"
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between focus:outline-none focus:bg-gray-50
                      ${currentLang === lang ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'}
                    `}
                  >
                    <span>{LANGUAGE_LABELS[lang]}</span>
                    {currentLang === lang && <Check className="w-3 h-3 text-black" />}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Global Search Bar - simplified for demo */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-black transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2 rtl:ml-2 rtl:mr-0" />
          <input 
            type="text" 
            placeholder={t('common.searchPlaceholder')} 
            className="bg-transparent border-none focus:outline-none text-sm text-gray-700 w-full"
          />
        </div>

        <button 
           onClick={onNotificationClick}
           className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 rtl:left-1 rtl:right-auto w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
        </button>
        
        <div 
           onClick={onProfileClick}
           className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <UserIcon className="w-5 h-5 text-gray-700" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
