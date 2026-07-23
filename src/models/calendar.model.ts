import { SearchIntent, PriorityLevel, SourceType } from './schema.js';
import { ContentGapItem, OutdatedBlogItem, SeasonalTripItem, FAQItem } from './audit.model.js';

export interface ContentCalendarItem {
  id: string;
  publishDate: string;        // Field 1: YYYY-MM-DD
  blogTitle: string;          // Field 2: Blog Title
  primaryKeyword: string;     // Field 3: Primary Keyword
  secondaryKeywords: string[];// Field 4: Secondary Keyword(s)
  searchIntent: SearchIntent; // Field 5: Search Intent
  targetAudience: string;     // Field 6: Target Audience
  contentType: string;        // Field 7: Content Type
  linkToBlog: string;         // Field 8: Link to Blog
  cta: string;                // Field 9: CTA
  priority: PriorityLevel;    // Field 10: Priority (High/Medium/Low)
  sourceType?: SourceType;
}

export interface ContentAuditReport {
  auditId: string;
  domainUrl: string;
  auditedAt: string;
  totalPagesIndexed: number;
  contentGaps: ContentGapItem[];
  outdatedBlogs: OutdatedBlogItem[];
  seasonalTrips: SeasonalTripItem[];
  faqOpportunities: FAQItem[];
  calendar: ContentCalendarItem[];
}
