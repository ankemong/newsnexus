import { Language } from '../types';

const BOCHA_API_URL = 'https://api.bocha.cn/v1/web-search';

export interface BochaWebSearchResult {
    id: string | null;
    name: string;
    url: string;
    displayUrl: string;
    snippet: string;
    summary?: string;
    siteName: string;
    siteIcon: string;
    datePublished: string;
    dateLastCrawled: string;
    cachedPageUrl: string | null;
    language: string | null;
    isFamilyFriendly: boolean | null;
    isNavigational: boolean | null;
}

export interface BochaWebPages {
    webSearchUrl: string;
    totalEstimatedMatches: number;
    value: BochaWebSearchResult[];
    someResultsRemoved: boolean;
}

export interface BochaApiResponse {
    code: number;
    log_id: string;
    msg: string | null;
    data: {
        _type: string;
        queryContext: {
            originalQuery: string;
        };
        webPages: BochaWebPages;
        images?: any; 
        videos?: any;
    };
}

export class BochaService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Bocha API key is missing.');
    }
    this.apiKey = apiKey;
  }

  async search(query: string, options?: {
    freshness?: 'noLimit' | 'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear' | string;
    summary?: boolean;
    include?: string;
    exclude?: string;
    count?: number;
  }): Promise<BochaApiResponse> {
    try {
      const response = await fetch(BOCHA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          freshness: options?.freshness || 'noLimit',
          summary: options?.summary || false,
          count: options?.count || 10,
          ...(options?.include && { include: options.include }),
          ...(options?.exclude && { exclude: options.exclude }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
        console.error('Bocha API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching with Bocha API:', error);
      throw error;
    }
  }
}