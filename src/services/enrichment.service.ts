import { ContentCalendarItem } from '../models/calendar.model.js';
import { ContentCalendarItemSchema } from '../models/schema.js';
import { PriorityEngine } from './priority-engine.js';

export interface RawPostInput {
  title: string;
  primaryKeyword?: string;
  targetAudience?: string;
  preferredPublishDate?: string;
}

export class EnrichmentService {
  private priorityEngine = new PriorityEngine();

  enrichPosts(posts: RawPostInput[]): ContentCalendarItem[] {
    const calendar: ContentCalendarItem[] = [];

    posts.forEach((post, idx) => {
      const titleLower = post.title.toLowerCase();

      // Default or calculated publish date
      const today = new Date();
      today.setDate(today.getDate() + (idx + 1) * 7);
      const publishDate = post.preferredPublishDate || today.toISOString().substring(0, 10);

      // Infer keyword if missing
      const primaryKeyword = post.primaryKeyword || titleLower.replace(/[^\w\s]/gi, '').trim();

      // Infer search intent
      let searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational' = 'Informational';
      if (
        titleLower.includes('best') ||
        titleLower.includes('top') ||
        titleLower.includes('vs') ||
        titleLower.includes('review') ||
        titleLower.includes('boots') ||
        titleLower.includes('gear')
      ) {
        searchIntent = 'Commercial';
      } else if (titleLower.includes('buy') || titleLower.includes('book') || titleLower.includes('cost') || titleLower.includes('price')) {
        searchIntent = 'Transactional';
      }

      // Infer content type
      let contentType = 'Blog Post';
      if (titleLower.includes('guide')) contentType = 'Guide';
      else if (titleLower.includes('itinerary')) contentType = 'Itinerary';
      else if (titleLower.includes('top') || titleLower.includes('best')) contentType = 'Listicle / Comparison';

      const targetAudience = post.targetAudience || 'Outdoor Travelers & Trekkers';
      const slug = primaryKeyword.replace(/\s+/g, '-');
      const linkToBlog = `/blog/${slug}`;

      let cta = 'Read Full Article & Learn More';
      if (searchIntent === 'Commercial') cta = 'Check Best Prices & Options';
      else if (searchIntent === 'Transactional') cta = 'Book Package Today';

      const priority = this.priorityEngine.calculatePriority({ searchIntent });

      const calendarItem: ContentCalendarItem = {
        id: `post-enrich-${Date.now()}-${idx + 1}`,
        publishDate,
        blogTitle: post.title,
        primaryKeyword,
        secondaryKeywords: [primaryKeyword, 'travel guide', 'tips'],
        searchIntent,
        targetAudience,
        contentType,
        linkToBlog,
        cta,
        priority,
        sourceType: 'ManualPost',
      };

      // Validate strict 10-field schema
      ContentCalendarItemSchema.parse(calendarItem);

      calendar.push(calendarItem);
    });

    return calendar;
  }
}
