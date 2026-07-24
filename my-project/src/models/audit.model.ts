import { SearchIntent, PriorityLevel } from './schema.js';

export interface ContentGapItem {
  gapId: string;
  topicCluster: string;
  suggestedTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  estimatedSearchVolume: 'High' | 'Medium' | 'Low';
  priority: PriorityLevel;
}

export interface OutdatedBlogItem {
  itemId: string;
  url: string;
  currentTitle: string;
  lastUpdatedDate: string;
  stalenessReason: string;
  suggestedActions: string[];
  priority: PriorityLevel;
}

export interface SeasonalTripItem {
  tripId: string;
  tripName: string;
  peakSeasonMonths: string[];
  recommendedPublishDate: string; // 60-90 days prior to peak season
  targetAudience: string;
  primaryKeyword: string;
  priority: PriorityLevel;
}

export interface FAQItem {
  faqId: string;
  question: string;
  suggestedAnswerOutline: string;
  targetKeyword: string;
  parentBlogUrl?: string;
  priority: PriorityLevel;
}
