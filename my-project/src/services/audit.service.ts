import { ContentAuditReport, ContentCalendarItem } from '../models/calendar.model.js';
import { ScraperService, PageMetadata } from './scraper.service.js';
import { GapAnalyzer } from './gap-analyzer.js';
import { OutdatedAnalyzer } from './outdated-analyzer.js';
import { SeasonalAnalyzer } from './seasonal-analyzer.js';
import { FAQAnalyzer } from './faq-analyzer.js';
import { CalendarService } from './calendar.service.js';

export class AuditService {
  private scraper = new ScraperService();
  private gapAnalyzer = new GapAnalyzer();
  private outdatedAnalyzer = new OutdatedAnalyzer();
  private seasonalAnalyzer = new SeasonalAnalyzer();
  private faqAnalyzer = new FAQAnalyzer();
  private calendarService = new CalendarService();

  async runDomainAudit(domainUrl: string, maxPages: number = 50): Promise<ContentAuditReport> {
    const urls = await this.scraper.discoverUrls(domainUrl, maxPages);
    const pageMetas: PageMetadata[] = [];

    for (const url of urls) {
      const meta = await this.scraper.scrapePage(url);
      pageMetas.push(meta);
    }

    // Run modular audit analyzers
    const contentGaps = this.gapAnalyzer.analyzeGaps(pageMetas);
    const outdatedBlogs = this.outdatedAnalyzer.analyzeOutdated(pageMetas);
    const seasonalTrips = this.seasonalAnalyzer.analyzeSeasonalTrips();
    const faqOpportunities = this.faqAnalyzer.analyzeFAQs(pageMetas);

    // Build 10-field content calendar from indexed pages + audit recommendations
    const calendar: ContentCalendarItem[] = [];

    // 1. Map existing indexed pages
    pageMetas.forEach((meta, idx) => {
      calendar.push(this.calendarService.generateCalendarItem(meta, idx));
    });

    // 2. Map content gaps into upcoming high-priority calendar slots
    contentGaps.forEach((gap, idx) => {
      const today = new Date();
      today.setDate(today.getDate() + (calendar.length + 1) * 7);
      calendar.push({
        id: `cal-gap-${Date.now()}-${idx + 1}`,
        publishDate: today.toISOString().substring(0, 10),
        blogTitle: gap.suggestedTitle,
        primaryKeyword: gap.primaryKeyword,
        secondaryKeywords: gap.secondaryKeywords,
        searchIntent: gap.searchIntent,
        targetAudience: 'Adventure Seekers & Trekkers',
        contentType: 'Comprehensive Guide',
        linkToBlog: `/blog/${gap.primaryKeyword.replace(/\s+/g, '-')}`,
        cta: 'Explore Trekking Itineraries & Packages',
        priority: gap.priority,
        sourceType: 'AuditGap',
      });
    });

    // 3. Map seasonal trip opportunities
    seasonalTrips.forEach((trip, idx) => {
      calendar.push({
        id: `cal-season-${Date.now()}-${idx + 1}`,
        publishDate: trip.recommendedPublishDate,
        blogTitle: `${trip.tripName}: Seasonal Guide & Planning Tips`,
        primaryKeyword: trip.primaryKeyword,
        secondaryKeywords: [trip.tripName.toLowerCase(), 'trekking season'],
        searchIntent: 'Commercial',
        targetAudience: trip.targetAudience,
        contentType: 'Trekking Itinerary',
        linkToBlog: `/treks/${trip.tripName.toLowerCase().replace(/\s+/g, '-')}`,
        cta: 'Book Seasonal Trek Spot Early',
        priority: trip.priority,
        sourceType: 'AuditSeasonal',
      });
    });

    return {
      auditId: `audit-${Date.now()}`,
      domainUrl,
      auditedAt: new Date().toISOString(),
      totalPagesIndexed: pageMetas.length,
      contentGaps: contentGaps.slice(0, 3),
      outdatedBlogs: outdatedBlogs.slice(0, 2),
      seasonalTrips: seasonalTrips.slice(0, 2),
      faqOpportunities: faqOpportunities.slice(0, 2),
      calendar: calendar.slice(0, 5),
    };
  }
}
