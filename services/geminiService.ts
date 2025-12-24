
import { Article, Language } from "../types";
import { BochaService } from "./bochaService";

// Bocha API Configuration
const BOCHA_API_KEY = import.meta.env.VITE_BOCHA_API_KEY || '';

// Initialize Bocha Client
const getBochaClient = () => {
  if (!BOCHA_API_KEY) {
    throw new Error("Bocha API Key is missing.");
  }
  return new BochaService(BOCHA_API_KEY);
};

/**
 * 使用博查API搜索新闻文章
 * 只返回真实的搜索结果，不包含任何模拟数据
 */
export const crawlNewsByKeyword = async (keyword: string, languages: Language[]): Promise<Article[]> => {
  try {
    return await crawlWithBocha(keyword, languages);
  } catch (error) {
    console.error("博查API搜索失败:", error);
    throw new Error(`搜索失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 使用博查API进行新闻搜索
 */
const crawlWithBocha = async (keyword: string, languages: Language[]): Promise<Article[]> => {
  const client = getBochaClient();

  try {
    const response = await client.search(keyword, {
      freshness: 'oneWeek',
      summary: true,
      count: 10
    });

    if (!response.data?.webPages?.value || response.data.webPages.value.length === 0) {
      throw new Error('未找到相关文章');
    }

    const articles: Article[] = response.data.webPages.value
      .filter((result: any) => result.snippet && result.snippet.length > 50)
      .slice(0, 10)
      .map((result: any, index: number) => ({
        id: `bocha-${Date.now()}-${index}`,
        title: result.name || result.title || '无标题',
        source: result.siteName || '未知来源',
        publishedAt: result.datePublished ? new Date(result.datePublished).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        url: result.url,
        content: result.snippet || result.summary || '无内容摘要',
        language: result.language || languages[0] || 'ZH',
        category: 'General',
        sentiment: 'neutral',
        imageUrl: `https://picsum.photos/800/600?random=${index + Date.now()}`
      } as Article));

    return articles;
  } catch (error) {
    console.error("博查API调用失败:", error);
    throw error;
  }
};

/**
 * 使用博查API扩展文章内容
 */
export const expandArticleContent = async (title: string, currentContent: string, language: string): Promise<string> => {
  // 博查API主要用于搜索，暂时返回原内容
  // 未来可以考虑使用博查API搜索相关文章来扩展内容
  return currentContent;
};

/**
 * 使用博查API生成文章摘要
 */
export const summarizeArticleContent = async (text: string): Promise<string> => {
  // 博查API主要用于搜索，暂时返回简单摘要
  // 未来可以考虑使用博查API搜索相关内容来生成摘要
  const sentences = text.split('。');
  return sentences.slice(0, 3).join('。') + '。';
};

/**
 * 使用博查API翻译文本
 */
export const translateArticleText = async (text: string, targetLanguage: string): Promise<string> => {
  // 博查API主要用于搜索，暂时返回原文本
  // 未来可以考虑使用博查API搜索目标语言的相似内容
  return text;
};
