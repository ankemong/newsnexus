import { Article, Language } from '../types';

// NewsAPI 配置
const NEWS_API_CONFIG = {
  baseUrl: 'https://newsapi.org/v2',
  apiKey: import.meta.env.VITE_NEWS_API_KEY || '',
  // 备用新闻源
  sources: [
    'bbc-news',
    'cnn',
    'reuters',
    'the-verge',
    'techcrunch',
    'bloomberg',
    'the-wall-street-journal',
    'the-guardian-uk',
    'wired',
    'ars-technica'
  ]
};

// The Guardian API 配置（备用）
const GUARDIAN_CONFIG = {
  baseUrl: 'https://content.guardianapis.com',
  apiKey: import.meta.env.VITE_GUARDIAN_API_KEY || ''
};

// GNews API 配置（备用）
const GNEWS_CONFIG = {
  baseUrl: 'https://gnews.io/api/v4',
  apiKey: import.meta.env.VITE_GNEWS_API_KEY || ''
};

/**
 * 使用 NewsAPI 获取真实新闻
 */
export const fetchNewsFromNewsAPI = async (
  keyword: string,
  language: string = 'en',
  pageSize: number = 10
): Promise<Article[]> => {
  if (!NEWS_API_CONFIG.apiKey) {
    throw new Error('NewsAPI key is missing. Please set VITE_NEWS_API_KEY in your .env.local file.');
  }

  try {
    // 构建语言映射
    const languageMap: Record<string, string> = {
      'en': 'en',
      'zh': 'zh',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'ja': 'ja',
      'ko': 'ko',
      'pt': 'pt',
      'ru': 'ru',
      'ar': 'ar',
      'hi': 'hi',
      'it': 'it',
      'nl': 'nl',
      'no': 'no',
      'sv': 'sv',
      'da': 'da',
      'fi': 'fi',
      'pl': 'pl',
      'tr': 'tr'
    };

    const lang = languageMap[language] || 'en';

    // 首先尝试搜索新闻
    const searchUrl = `${NEWS_API_CONFIG.baseUrl}/everything?q=${encodeURIComponent(keyword)}&language=${lang}&pageSize=${pageSize}&sortBy=publishedAt&sortBy=popularity`;

    const response = await fetch(searchUrl, {
      headers: {
        'X-API-Key': NEWS_API_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`);
    }

    // 转换为我们的 Article 格式
    return data.articles.map((article: any, index: number) => ({
      id: `newsapi-${Date.now()}-${index}`,
      title: article.title || 'No title',
      source: article.source?.name || 'Unknown Source',
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url || '#',
      content: article.description || article.content || 'No content available',
      language: language,
      category: 'General',
      sentiment: 'neutral',
      imageUrl: article.urlToImage || `https://picsum.photos/800/600?random=${Date.now() + index}`
    }));

  } catch (error) {
    console.error('NewsAPI fetch error:', error);
    throw error;
  }
};

/**
 * 使用 The Guardian API 获取新闻（备用方案）
 */
export const fetchNewsFromGuardian = async (
  keyword: string,
  pageSize: number = 10
): Promise<Article[]> => {
  if (!GUARDIAN_CONFIG.apiKey) {
    throw new Error('Guardian API key is missing.');
  }

  try {
    const url = `${GUARDIAN_CONFIG.baseUrl}/search?q=${encodeURIComponent(keyword)}&api-key=${GUARDIAN_CONFIG.apiKey}&page-size=${pageSize}&order-by=newest&show-fields=headline,trailText,byline,publication,webUrl,thumbnail`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }

    const data = await response.json();

    return data.response?.results?.map((article: any, index: number) => ({
      id: `guardian-${Date.now()}-${index}`,
      title: article.webTitle || 'No title',
      source: 'The Guardian',
      publishedAt: article.webPublicationDate || new Date().toISOString(),
      url: article.webUrl || '#',
      content: article.fields?.trailText || 'No content available',
      language: 'en',
      category: article.sectionName || 'General',
      sentiment: 'neutral',
      imageUrl: article.fields?.thumbnail || `https://picsum.photos/800/600?random=${Date.now() + index}`
    })) || [];

  } catch (error) {
    console.error('Guardian API fetch error:', error);
    throw error;
  }
};

/**
 * 使用 GNews API 获取新闻（备用方案）
 */
export const fetchNewsFromGNews = async (
  keyword: string,
  language: string = 'en',
  pageSize: number = 10
): Promise<Article[]> => {
  if (!GNEWS_CONFIG.apiKey) {
    throw new Error('GNews API key is missing.');
  }

  try {
    const url = `${GNEWS_CONFIG.baseUrl}/search?q=${encodeURIComponent(keyword)}&lang=${language}&max=${pageSize}&country=us&sortby=publishedAt`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();

    return data.articles?.map((article: any, index: number) => ({
      id: `gnews-${Date.now()}-${index}`,
      title: article.title || 'No title',
      source: article.source?.name || 'Unknown Source',
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url || '#',
      content: article.description || 'No content available',
      language: language,
      category: 'General',
      sentiment: 'neutral',
      imageUrl: article.image || `https://picsum.photos/800/600?random=${Date.now() + index}`
    })) || [];

  } catch (error) {
    console.error('GNews API fetch error:', error);
    throw error;
  }
};

/**
 * 获取真实新闻的主要函数
 * 会依次尝试不同的新闻源，直到成功获取数据
 */
export const getRealNews = async (
  keyword: string,
  languages: Language[],
  maxResults: number = 10
): Promise<Article[]> => {
  const errors: string[] = [];

  // 尝试使用 NewsAPI
  try {
    const news = await fetchNewsFromNewsAPI(keyword, languages[0] || 'en', maxResults);
    if (news.length > 0) {
      return news;
    }
  } catch (error) {
    errors.push(`NewsAPI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // 尝试使用 GNews
  try {
    const news = await fetchNewsFromGNews(keyword, languages[0] || 'en', maxResults);
    if (news.length > 0) {
      return news;
    }
  } catch (error) {
    errors.push(`GNews: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // 尝试使用 Guardian（仅英文）
  if (languages.includes('en')) {
    try {
      const news = await fetchNewsFromGuardian(keyword, maxResults);
      if (news.length > 0) {
        return news;
      }
    } catch (error) {
      errors.push(`Guardian: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 如果所有 API 都失败了
  throw new Error(`Failed to fetch news from any source. Errors: ${errors.join('; ')}`);
};

/**
 * 获取热门新闻头条
 */
export const getTopHeadlines = async (
  language: string = 'en',
  category?: string,
  country: string = 'us'
): Promise<Article[]> => {
  if (!NEWS_API_CONFIG.apiKey) {
    throw new Error('NewsAPI key is missing.');
  }

  try {
    let url = `${NEWS_API_CONFIG.baseUrl}/top-headlines?country=${country}&pageSize=20`;

    if (category && category !== 'General') {
      url += `&category=${category}`;
    }

    const response = await fetch(url, {
      headers: {
        'X-API-Key': NEWS_API_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch headlines: ${response.status}`);
    }

    const data = await response.json();

    return data.articles?.map((article: any, index: number) => ({
      id: `headline-${Date.now()}-${index}`,
      title: article.title || 'No title',
      source: article.source?.name || 'Unknown Source',
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url || '#',
      content: article.description || article.content || 'No content available',
      language: language,
      category: category || 'General',
      sentiment: 'neutral',
      imageUrl: article.urlToImage || `https://picsum.photos/800/600?random=${Date.now() + index}`
    })) || [];

  } catch (error) {
    console.error('Failed to fetch headlines:', error);
    throw error;
  }
};