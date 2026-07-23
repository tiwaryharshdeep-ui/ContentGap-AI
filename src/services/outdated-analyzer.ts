import { OutdatedBlogItem } from '../models/audit.model.js';
import { PageMetadata } from './scraper.service.js';

export class OutdatedAnalyzer {
  private currentYear = new Date().getFullYear();

  analyzeOutdated(pages: PageMetadata[]): OutdatedBlogItem[] {
    const outdatedList: OutdatedBlogItem[] = [];

    for (const page of pages) {
      const titleLower = page.title.toLowerCase();
      const reasons: string[] = [];
      const actions: string[] = [];

      // Check for past year in title
      for (let yr = 2018; yr < this.currentYear; yr++) {
        if (titleLower.includes(yr.toString())) {
          reasons.push(`Outdated year ${yr} in headline title`);
          actions.push(`Update title to current year (${this.currentYear})`);
          actions.push('Refresh statistics, permits, and booking fee details');
        }
      }

      // Check publish date age
      if (page.publishedDate) {
        const pubDate = new Date(page.publishedDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 365) {
          reasons.push(`Article published ${diffDays} days ago (>1 year old)`);
          actions.push('Review and update internal links to newer articles');
          actions.push('Add modern FAQ section for search snippet capture');
        }
      }

      if (reasons.length > 0) {
        outdatedList.push({
          itemId: `outdated-${Date.now()}-${outdatedList.length + 1}`,
          url: page.url,
          currentTitle: page.title,
          lastUpdatedDate: page.publishedDate || '2023-01-01',
          stalenessReason: reasons.join('; '),
          suggestedActions: actions.length > 0 ? Array.from(new Set(actions)) : ['Refresh SEO content and metadata'],
          priority: 'High',
        });
      }
    }

    return outdatedList;
  }
}
