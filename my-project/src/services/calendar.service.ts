import { ContentCalendarItem } from '../models/calendar.model.js';
import { ContentCalendarItemSchema } from '../models/schema.js';
import { PriorityEngine } from './priority-engine.js';
import { PageMetadata } from './scraper.service.js';

export class CalendarService {
  private priorityEngine = new PriorityEngine();

  /**
   * Generates a fully compliant 10-field content calendar item from scraped page metadata or topic input
   */
  generateCalendarItem(meta: PageMetadata, index: number): ContentCalendarItem {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (index + 1) * 7); // Schedule weekly
    const publishDate = targetDate.toISOString().substring(0, 10);

    const titleLower = meta.title.toLowerCase();
    
    // Infer search intent
    let searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational' = 'Informational';
    if (titleLower.includes('best') || titleLower.includes('buying') || titleLower.includes('review') || titleLower.includes('vs')) {
      searchIntent = 'Commercial';
    } else if (titleLower.includes('book') || titleLower.includes('cost') || titleLower.includes('price') || titleLower.includes('package')) {
      searchIntent = 'Transactional';
    }

    // Infer content type
    let contentType = 'Blog Post';
    if (titleLower.includes('guide')) contentType = 'Comprehensive Guide';
    else if (titleLower.includes('itinerary')) contentType = 'Trekking Itinerary';
    else if (titleLower.includes('top') || titleLower.includes('best')) contentType = 'Listicle / Comparison';
    else if (meta.h2s.some(h => h.toLowerCase().includes('faq') || h.toLowerCase().includes('question'))) contentType = 'FAQ Article';

    // Infer primary and secondary keywords
    const primaryKeyword = meta.keywords[0] || meta.h1.toLowerCase() || 'trekking guide';
    const secondaryKeywords = meta.keywords.length > 1 ? meta.keywords.slice(1, 4) : ['himalayan trekking', 'outdoor travel tips'];

    // Target audience
    let targetAudience = 'Outdoor Enthusiasts & Trekkers';
    if (titleLower.includes('beginner') || titleLower.includes('easy')) targetAudience = 'Beginner Trekkers & Families';
    else if (titleLower.includes('solo')) targetAudience = 'Solo Backpackers';

    // CTA
    let cta = 'Read Full Guide & Book Your Trek';
    if (searchIntent === 'Commercial') cta = 'Compare Top Gear & Trekking Packages';
    else if (searchIntent === 'Transactional') cta = 'Reserve Your Trekking Spot Today';

    // Calculate priority using PriorityEngine
    const hasOutdatedYearTitle = titleLower.includes('2022') || titleLower.includes('2023') || titleLower.includes('2024');
    const priority = this.priorityEngine.calculatePriority({
      searchIntent,
      hasOutdatedYearTitle,
    });

    const item: ContentCalendarItem = {
      id: `cal-${Date.now()}-${index + 1}`,
      publishDate,
      blogTitle: meta.title || meta.h1,
      primaryKeyword,
      secondaryKeywords,
      searchIntent,
      targetAudience,
      contentType,
      linkToBlog: meta.url,
      cta,
      priority,
      sourceType: 'ManualPost',
    };

    // Strict 10-Field Schema Validation Check
    ContentCalendarItemSchema.parse(item);

    return item;
  }
}
