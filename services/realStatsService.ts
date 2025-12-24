import { Article } from '../types';
import { addArticlesToStats as addToLocalStats, recordSearchInStats as recordSearchToLocalStats } from './localStatsService';

// Real implementation of statistics service
class RealStatsService {
  private apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || 'https://api.newsnexus.com';
  private isOnline: boolean = true;
  private lastSyncTime: number = 0;
  private syncInterval: number = 5 * 60 * 1000; // 5 minutes

  // Check if we're online and can reach the API
  private async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Offline mode - using local storage only');
      return false;
    }
  }

  // Sync local data with server
  async syncWithServer() {
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncInterval) return;

    try {
      this.isOnline = await this.checkConnection();
      if (!this.isOnline) return;

      // Here you would implement the actual sync logic with your backend
      // For example:
      // const localChanges = this.getLocalChanges();
      // await fetch(`${this.apiBaseUrl}/sync`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(localChanges)
      // });
      
      this.lastSyncTime = now;
    } catch (error) {
      console.error('Failed to sync with server:', error);
      this.isOnline = false;
    }
  }

  // Add articles to statistics
  async addArticles(articles: Article[]) {
    // Add to local stats immediately for better UX
    addToLocalStats(articles);

    // Try to sync with server in the background
    if (this.isOnline) {
      try {
        await fetch(`${this.apiBaseUrl}/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articles)
        });
      } catch (error) {
        console.warn('Failed to sync articles with server, using local storage only');
        this.isOnline = false;
      }
    }
  }

  // Record a search
  async recordSearch(keyword: string, processingTime?: number) {
    // Record to local stats immediately
    recordSearchToLocalStats(keyword, processingTime);

    // Try to sync with server in the background
    if (this.isOnline) {
      try {
        await fetch(`${this.apiBaseUrl}/searches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, processingTime, timestamp: new Date().toISOString() })
        });
      } catch (error) {
        console.warn('Failed to sync search with server, using local storage only');
        this.isOnline = false;
      }
    }
  }

  // Get real-time statistics
  async getStats() {
    // Try to get fresh data from server if online
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/stats`);
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.warn('Failed to fetch real-time stats, falling back to local data');
        this.isOnline = false;
      }
    }

    // Fall back to local data if offline or server request fails
    return {
      // This would be replaced with actual local data aggregation
      totalArticles: 0,
      activeSearches: 0,
      avgProcessingTime: 0,
      readership: 0,
      weeklyChange: {
        articles: 0,
        searches: 0,
        processingTime: 0,
        readership: 0
      }
    };
  }
}

// Export a singleton instance
export const realStatsService = new RealStatsService();

// Initialize the service
realStatsService.syncWithServer();

// Set up periodic sync
setInterval(() => realStatsService.syncWithServer(), 5 * 60 * 1000); // Sync every 5 minutes
