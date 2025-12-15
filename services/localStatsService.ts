import { Article } from '../types';

export interface LocalStatsData {
  totalArticles: number;
  activeCrawlers: number;
  avgProcessingTime: number;
  readership: number;
  weeklyChange: {
    articles: number;
    crawlers: number;
    processingTime: number;
    readership: number;
  };
}

// 本地存储统计数据
class LocalStatsManager {
  private static instance: LocalStatsManager;
  private articles: Article[] = [];
  private searchHistory: Array<{
    keyword: string;
    timestamp: number;
    processingTime?: number;
  }> = [];
  private sessionStartTime: number = Date.now();
  private lastWeekData: LocalStatsData | null = null;

  private constructor() {
    // 从 localStorage 恢复数据
    this.loadFromStorage();
  }

  static getInstance(): LocalStatsManager {
    if (!LocalStatsManager.instance) {
      LocalStatsManager.instance = new LocalStatsManager();
    }
    return LocalStatsManager.instance;
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('newsnexus_stats');
      if (saved) {
        const data = JSON.parse(saved);
        // 只保留最近7天的数据
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        this.articles = (data.articles || []).filter((a: Article) =>
          new Date(a.publishedAt).getTime() > sevenDaysAgo
        );
        this.searchHistory = (data.searchHistory || []).filter((s: any) =>
          s.timestamp > sevenDaysAgo
        );
        this.sessionStartTime = data.sessionStartTime || Date.now();

        // 计算上周数据用于对比
        this.calculateLastWeekData();
      }
    } catch (error) {
      console.error('Failed to load stats from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        articles: this.articles,
        searchHistory: this.searchHistory,
        sessionStartTime: this.sessionStartTime
      };
      localStorage.setItem('newsnexus_stats', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save stats to storage:', error);
    }
  }

  private calculateLastWeekData() {
    // 模拟上周数据（实际项目中应该从历史数据计算）
    this.lastWeekData = {
      totalArticles: Math.floor(this.articles.length * 0.85),
      activeCrawlers: Math.max(0, this.getActiveCrawlers() - 2),
      avgProcessingTime: 1.5,
      readership: Math.max(0, this.getReadership() - 100),
      weeklyChange: {
        articles: 0,
        crawlers: 0,
        processingTime: 0,
        readership: 0
      }
    };
  }

  // 添加新文章
  addArticles(newArticles: Article[]) {
    this.articles = [...this.articles, ...newArticles];
    // 保留最近1000篇文章
    if (this.articles.length > 1000) {
      this.articles = this.articles.slice(-1000);
    }
    this.saveToStorage();
  }

  // 记录搜索
  recordSearch(keyword: string, processingTime?: number, articleCount?: number) {
    const searchEntry = {
      keyword,
      timestamp: Date.now(),
      processingTime,
      articleCount
    };
    this.searchHistory.push(searchEntry);
    // 保留最近100次搜索
    if (this.searchHistory.length > 100) {
      this.searchHistory = this.searchHistory.slice(-100);
    }
    this.saveToStorage();

    // 同时记录到专门的搜索日志
    const searchLog = JSON.parse(localStorage.getItem('newsnexus_search_log') || '[]');
    searchLog.push(searchEntry);
    // 保留最近50次搜索日志
    if (searchLog.length > 50) {
      searchLog.splice(0, searchLog.length - 50);
    }
    localStorage.setItem('newsnexus_search_log', JSON.stringify(searchLog));
  }

  // 获取搜索历史
  getSearchHistory() {
    return this.searchHistory;
  }

  // 获取文章总数
  getTotalArticles(): number {
    return this.articles.length;
  }

  // 获取活跃爬虫数（最近1小时内的搜索）
  getActiveCrawlers(): number {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentSearches = this.searchHistory.filter(s => s.timestamp > oneHourAgo);
    // 假设每个不同的关键词代表一个活跃爬虫
    const uniqueKeywords = new Set(recentSearches.map(s => s.keyword));
    return uniqueKeywords.size;
  }

  // 获取平均处理时间
  getAvgProcessingTime(): number {
    const processingTimes = this.searchHistory
      .filter(s => s.processingTime)
      .map(s => s.processingTime!);

    if (processingTimes.length === 0) return 1.2;

    const avg = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    return Math.round(avg * 10) / 10;
  }

  // 获取读者数量（模拟）
  getReadership(): number {
    // 基于文章数量和搜索活跃度模拟读者数量
    const baseReadership = 1000;
    const articleBonus = Math.min(this.articles.length * 2, 500);
    const searchBonus = Math.min(this.searchHistory.length * 5, 300);
    const sessionBonus = Math.min((Date.now() - this.sessionStartTime) / (1000 * 60), 200);

    return Math.floor(baseReadership + articleBonus + searchBonus + sessionBonus);
  }

  // 获取完整统计数据
  getStats(): LocalStatsData {
    const currentData = {
      totalArticles: this.getTotalArticles(),
      activeCrawlers: this.getActiveCrawlers(),
      avgProcessingTime: this.getAvgProcessingTime(),
      readership: this.getReadership(),
      weeklyChange: {
        articles: 0,
        crawlers: 0,
        processingTime: 0,
        readership: 0
      }
    };

    // 计算周环比变化
    if (this.lastWeekData) {
      currentData.weeklyChange.articles = this.lastWeekData.totalArticles > 0
        ? Math.round(((currentData.totalArticles - this.lastWeekData.totalArticles) / this.lastWeekData.totalArticles) * 100 * 10) / 10
        : Math.round(Math.random() * 20);

      currentData.weeklyChange.crawlers = currentData.activeCrawlers - this.lastWeekData.activeCrawlers;
      currentData.weeklyChange.processingTime = Math.round((currentData.avgProcessingTime - this.lastWeekData.avgProcessingTime) * 10) / 10;
      currentData.weeklyChange.readership = this.lastWeekData.readership > 0
        ? Math.round(((currentData.readership - this.lastWeekData.readership) / this.lastWeekData.readership) * 100 * 10) / 10
        : Math.round(Math.random() * 15);
    } else {
      // 如果没有上周数据，生成模拟变化
      currentData.weeklyChange.articles = Math.round(Math.random() * 20);
      currentData.weeklyChange.crawlers = Math.floor(Math.random() * 5);
      currentData.weeklyChange.processingTime = Math.round((Math.random() - 0.5) * 10) / 10;
      currentData.weeklyChange.readership = Math.round(Math.random() * 15);
    }

    return currentData;
  }

  // 清除所有数据
  clearAll() {
    this.articles = [];
    this.searchHistory = [];
    this.sessionStartTime = Date.now();
    this.lastWeekData = null;
    localStorage.removeItem('newsnexus_stats');
  }
}

// 导出单例实例
const statsManager = LocalStatsManager.getInstance();

// 导出服务函数
export const getLocalStats = (): LocalStatsData => {
  return statsManager.getStats();
};

export const addArticlesToStats = (articles: Article[]) => {
  statsManager.addArticles(articles);
};

export const recordSearchInStats = (keyword: string, processingTime?: number) => {
  statsManager.recordSearch(keyword, processingTime);
};

export const clearLocalStats = () => {
  statsManager.clearAll();
};