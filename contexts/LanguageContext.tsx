
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { resources } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LANGUAGE_STORAGE_KEY = 'newsnexus-language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 从本地存储初始化语言设置
  const getStoredLanguage = (): Language => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && Object.values(Language).includes(stored as Language)) {
        return stored as Language;
      }
    } catch (error) {
      console.warn('Failed to read language from localStorage:', error);
    }
    // 回退到浏览器语言或英语
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) {
      return browserLang.includes('TW') || browserLang.includes('HK') ? Language.TraditionalChinese : Language.Chinese;
    }
    if (browserLang.startsWith('es')) return Language.Spanish;
    if (browserLang.startsWith('fr')) return Language.French;
    if (browserLang.startsWith('de')) return Language.German;
    if (browserLang.startsWith('ja')) return Language.Japanese;
    if (browserLang.startsWith('ru')) return Language.Russian;
    if (browserLang.startsWith('pt')) return Language.Portuguese;
    if (browserLang.startsWith('ar')) return Language.Arabic;
    if (browserLang.startsWith('hi')) return Language.Hindi;
    if (browserLang.startsWith('it')) return Language.Italian;
    if (browserLang.startsWith('ko')) return Language.Korean;
    if (browserLang.startsWith('tr')) return Language.Turkish;
    if (browserLang.startsWith('nl')) return Language.Dutch;
    if (browserLang.startsWith('pl')) return Language.Polish;
    if (browserLang.startsWith('id')) return Language.Indonesian;
    if (browserLang.startsWith('vi')) return Language.Vietnamese;
    if (browserLang.startsWith('th')) return Language.Thai;

    return Language.English;
  };

  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  // 包装 setLanguage 以添加本地存储
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
  };

  // 更新 HTML 文档的 lang 和 dir 属性（支持 RTL）
  useEffect(() => {
    document.documentElement.lang = language;
    // 所有语言使用 LTR（从左到右）布局
    document.documentElement.dir = 'ltr';
  }, [language]);

  const t = (path: string, vars?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = resources[language];
    let fallback: any = resources[Language.English];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = undefined;
      }

      if (fallback && fallback[key] !== undefined) {
        fallback = fallback[key];
      } else {
        fallback = undefined;
      }
    }

    let result = current || fallback || path;

    // simple template interpolation: t('key', { name: 'x' }) => replaces {name}
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        result = result.replaceAll(`{${k}}`, String(v));
      }
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
