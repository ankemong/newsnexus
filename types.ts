
export type ViewState =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'dashboard'
  | 'subscriptions'
  | 'notifications'
  | 'profile'
  // Info pages
  | 'docs'
  | 'blog'
  | 'community'
  | 'help'
  | 'privacy'
  | 'terms'
  | 'cookie-policy'
  | 'contact'
  // legacy/compat (guarded in App.tsx)
  | 'analytics'
  | 'articles'
  | 'article-detail'
  | 'crawler';

export enum Language {
  English = 'en',
  Chinese = 'zh',
  TraditionalChinese = 'zh-TW',
  Spanish = 'es',
  French = 'fr',
  German = 'de',
  Japanese = 'ja',
  Korean = 'ko',
  Arabic = 'ar',
  Russian = 'ru',
  Portuguese = 'pt',
  Hindi = 'hi',
  Italian = 'it',
  Turkish = 'tr',
  Dutch = 'nl',
  Polish = 'pl',
  Indonesian = 'id',
  Vietnamese = 'vi',
  Thai = 'th'
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.English]: 'English',
  [Language.Chinese]: '中文',
  [Language.TraditionalChinese]: '繁體中文',
  [Language.Spanish]: 'Español',
  [Language.French]: 'Français',
  [Language.German]: 'Deutsch',
  [Language.Japanese]: '日本語',
  [Language.Korean]: '한국어',
  [Language.Arabic]: 'العربية',
  [Language.Russian]: 'Русский',
  [Language.Portuguese]: 'Português',
  [Language.Hindi]: 'हिन्दी',
  [Language.Italian]: 'Italiano',
  [Language.Turkish]: 'Türkçe',
  [Language.Dutch]: 'Nederlands',
  [Language.Polish]: 'Polski',
  [Language.Indonesian]: 'Bahasa Indonesia',
  [Language.Vietnamese]: 'Tiếng Việt',
  [Language.Thai]: 'ไทย'
};

export interface Subscription {
  id: string;
  url: string;
  type: 'RSS' | 'API' | 'HTML';
  name: string;
  status: 'healthy' | 'error';
  lastFetch: string;
}
