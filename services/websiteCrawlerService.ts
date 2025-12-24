import { Language } from '../types';

export interface CrawledContent {
  id: string;
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  crawledAt: string;
  author?: string;
  tags?: string[];
  wordCount?: number;
}

export interface CrawlResult {
  success: boolean;
  contents: CrawledContent[];
  error?: string;
  totalFound: number;
}

export class WebsiteCrawlerService {
  private apiKey: string;

  constructor(apiKey?: string) {
    // 支持多种API源的优先级配置
    this.apiKey = apiKey || import.meta.env.VITE_BOCHA_API_KEY || '';
  }

  /**
   * 爬取指定网站的内容
   * @param url 网站URL
   * @param options 爬取选项
   */
  async crawlWebsite(url: string, options?: {
    timeRange?: 'oneDay' | 'oneWeek' | 'oneMonth' | 'noLimit';
    maxArticles?: number;
    includeImages?: boolean;
    language?: Language;
  }): Promise<CrawlResult> {
    try {
      // 首先尝试使用博查API搜索该网站的内容
      if (this.apiKey) {
        return await this.crawlWithBochaAPI(url, options);
      } else {
        // 如果没有API密钥，使用模拟爬取
        return await this.mockCrawl(url, options);
      }
    } catch (error) {
      console.error('爬取失败:', error);
      return {
        success: false,
        contents: [],
        error: error instanceof Error ? error.message : '爬取失败',
        totalFound: 0
      };
    }
  }

  /**
   * 使用博查API进行内容爬取
   */
  private async crawlWithBochaAPI(url: string, options?: {
    timeRange?: 'oneDay' | 'oneWeek' | 'oneMonth' | 'noLimit';
    maxArticles?: number;
  }): Promise<CrawlResult> {
    try {
      const domain = new URL(url).hostname;
      const query = `site:${domain}`;

      const response = await fetch('https://api.bocha.cn/v1/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          freshness: options?.timeRange || 'oneMonth',
          summary: true,
          count: options?.maxArticles || 20,
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 200) {
        throw new Error(data.msg || 'API返回错误');
      }

      const contents: CrawledContent[] = data.data.webPages.value.map((item: any, index: number) => ({
        id: `${domain}-${Date.now()}-${index}`,
        title: item.name,
        url: item.url,
        content: item.summary || item.snippet,
        publishedAt: item.datePublished,
        crawledAt: new Date().toISOString(),
        author: item.siteName,
        wordCount: item.snippet.length,
        tags: [item.language || 'unknown']
      }));

      return {
        success: true,
        contents,
        totalFound: data.data.webPages.totalEstimatedMatches
      };
    } catch (error) {
      console.error('博查API爬取失败:', error);
      throw error;
    }
  }

  /**
   * 模拟爬取（用于测试和无API密钥的情况）
   */
  private async mockCrawl(url: string, options?: {
    timeRange?: 'oneDay' | 'oneWeek' | 'oneMonth' | 'noLimit';
    maxArticles?: number;
  }): Promise<CrawlResult> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      const domain = new URL(url).hostname;
      const maxArticles = options?.maxArticles || 5;

      const mockContents: CrawledContent[] = [
        {
          id: `${domain}-${Date.now()}-1`,
          title: `${domain} 最新动态：技术更新与产品发布`,
          url: `${url}/latest-update`,
          content: `这是从 ${domain} 爬取到的最新内容。包含该网站的重要更新、技术文章或产品信息。内容涵盖了多个方面的详细信息，为用户提供全面的理解。`,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2天前
          crawledAt: new Date().toISOString(),
          author: domain,
          wordCount: 150,
          tags: ['technology', 'update']
        },
        {
          id: `${domain}-${Date.now()}-2`,
          title: `深度分析：${domain} 行业趋势报告`,
          url: `${url}/industry-analysis`,
          content: `通过深度分析 ${domain} 相关的行业数据和发展趋势，我们发现了几个重要的变化。这些变化将对未来的发展方向产生重要影响。本文详细分析了各个方面的数据和趋势。`,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7天前
          crawledAt: new Date().toISOString(),
          author: domain,
          wordCount: 280,
          tags: ['analysis', 'trends']
        },
        {
          id: `${domain}-${Date.now()}-3`,
          title: `用户指南：${domain} 最佳实践分享`,
          url: `${url}/best-practices`,
          content: `基于 ${domain} 的使用经验，我们整理了一套最佳实践指南。这些实践来自于真实的使用案例和用户反馈，可以帮助其他用户更好地利用该平台的各项功能。`,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15天前
          crawledAt: new Date().toISOString(),
          author: domain,
          wordCount: 320,
          tags: ['guide', 'best-practices']
        }
      ].slice(0, maxArticles);

      return {
        success: true,
        contents: mockContents,
        totalFound: mockContents.length
      };
    } catch (error) {
      console.error('模拟爬取失败:', error);
      throw error;
    }
  }

  /**
   * 获取文章的详细内容（通过服务端代理解决跨域问题）
   */
  async getArticleContent(url: string): Promise<string> {
    try {
      console.log(`正在通过代理获取文章内容: ${url}`);

      // 使用服务端代理来获取文章内容
      const response = await fetch('http://localhost:3006/api/fetch-article-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        console.error(`代理请求失败: ${response.status} ${response.statusText}`);
        return '无法获取文章详细内容';
      }

      const result = await response.json();

      if (result.success && result.content) {
        console.log(`成功获取文章内容，长度: ${result.extractedLength || result.content.length}`);
        return result.content;
      } else {
        console.error('代理返回错误:', result.error);
        return '无法获取文章详细内容';
      }
    } catch (error) {
      console.error('获取文章内容失败:', error);
      // 如果代理失败，返回一个基本的提示信息
      return '无法获取文章详细内容，请直接访问原文链接查看完整内容。';
    }
  }

  /**
   * 检查网站是否支持爬取
   */
  async checkWebsiteSupport(url: string): Promise<{
    supported: boolean;
    reason?: string;
    suggestedType: 'RSS' | 'Website' | 'API';
  }> {
    try {
      const domain = new URL(url).hostname;

      // 检查常见的RSS路径
      const rssPaths = ['/rss', '/feed', '/rss.xml', '/feed.xml'];
      for (const path of rssPaths) {
        try {
          const response = await fetch(`${url}${path}`, { method: 'HEAD' });
          if (response.ok) {
            return {
              supported: true,
              suggestedType: 'RSS'
            };
          }
        } catch (e) {
          // 继续检查下一个路径
        }
      }

      // 默认支持网站爬取
      return {
        supported: true,
        suggestedType: 'Website'
      };
    } catch (error) {
      return {
        supported: false,
        reason: '无法访问该网站',
        suggestedType: 'Website'
      };
    }
  }
}