

export enum Language {
  English = 'en',
  Chinese = 'zh',
  TraditionalChinese = 'zh-TW',
  Spanish = 'es',
  French = 'fr',
  German = 'de',
  Japanese = 'ja',
  Russian = 'ru',
  Portuguese = 'pt',
  Arabic = 'ar',
  Hindi = 'hi',
  Italian = 'it',
  Korean = 'ko',
  Turkish = 'tr',
  Dutch = 'nl',
  Polish = 'pl',
  Indonesian = 'id',
  Vietnamese = 'vi',
  Thai = 'th'
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.English]: 'English',
  [Language.Chinese]: '简体中文 (Simplified Chinese)',
  [Language.TraditionalChinese]: '繁體中文 (Traditional Chinese)',
  [Language.Spanish]: 'Español (Spanish)',
  [Language.French]: 'Français (French)',
  [Language.German]: 'Deutsch (German)',
  [Language.Japanese]: '日本語 (Japanese)',
  [Language.Russian]: 'Русский (Russian)',
  [Language.Portuguese]: 'Português (Portuguese)',
  [Language.Arabic]: 'العربية (Arabic)',
  [Language.Hindi]: 'हिन्दी (Hindi)',
  [Language.Italian]: 'Italiano (Italian)',
  [Language.Korean]: '한국어 (Korean)',
  [Language.Turkish]: 'Türkçe (Turkish)',
  [Language.Dutch]: 'Nederlands (Dutch)',
  [Language.Polish]: 'Polski (Polish)',
  [Language.Indonesian]: 'Bahasa Indonesia',
  [Language.Vietnamese]: 'Tiếng Việt (Vietnamese)',
  [Language.Thai]: 'ไทย (Thai)',
};

export interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: string; // ISO date string
  url: string;
  summary?: string;
  language: Language;
  imageUrl?: string;
  content: string; // Full content or snippet
  category: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  avatar?: string;
}

export interface CrawlerTask {
  id: string;
  keyword: string;
  status: 'active' | 'paused' | 'completed';
  lastRun: string;
  articlesFound: number;
  languages: Language[];
}

export interface Subscription {
  id: string;
  url: string;
  type: 'RSS' | 'API' | 'HTML';
  name: string;
  status: 'healthy' | 'error';
  lastFetch: string;
}

export type ViewState =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'dashboard'
  | 'crawler'
  | 'my-crawls'
  | 'subscriptions'
  | 'articles'
  | 'article-detail'
  | 'notifications'
  | 'analytics'
  | 'profile'
  | 'payment'
  // Info Pages
  | 'docs'
  | 'blog'
  | 'community'
  | 'help'
  | 'privacy'
  | 'terms'
  | 'cookie-policy'
  | 'contact';

// Email related types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  timestamp: string;
  messageId?: string;
  error?: string;
}

// Re-export payment types
export * from './types/payment';
