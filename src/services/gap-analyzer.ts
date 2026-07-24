import { ContentGapItem } from '../models/audit.model.js';
import { PageMetadata } from './scraper.service.js';

export class GapAnalyzer {
  private standardNicheClusters = [
    { cluster: 'Beginner Treks', keyword: 'easy treks for beginners in himalayas', title: 'Top 10 Easy Himalayan Treks for Beginners', intent: 'Informational' as const },
    { cluster: 'Trekking Gear & Packing', keyword: 'himalayan trek packing list essentials', title: 'Ultimate Himalayan Trekking Packing Checklist', intent: 'Commercial' as const },
    { cluster: 'Fitness & Preparation', keyword: 'how to prepare for high altitude trek', title: 'High Altitude Trek Preparation & Fitness Routine', intent: 'Informational' as const },
    { cluster: 'Winter Treks', keyword: 'best winter snow treks in India', title: 'Complete Guide to Himalayan Winter Treks', intent: 'Commercial' as const },
    { cluster: 'Monsoon Treks', keyword: 'valley of flowers monsoon trek guide', title: 'Valley of Flowers & Monsoon Trekking Masterclass', intent: 'Informational' as const },
    { cluster: 'Trekking Booking & Safety', keyword: 'book licensed himalayan trek guide cost', title: 'Trek Booking Guide: Cost, Permits & Safety Tips', intent: 'Transactional' as const },
  ];

  analyzeGaps(pages: PageMetadata[]): ContentGapItem[] {
    const existingTitles = pages.map(p => p.title.toLowerCase());
    const existingKeywords = pages.flatMap(p => p.keywords.map(k => k.toLowerCase()));
    const existingContent = [...existingTitles, ...existingKeywords].join(' ');

    const gaps: ContentGapItem[] = [];

    for (const item of this.standardNicheClusters) {
      const isAddressed = existingContent.includes(item.cluster.toLowerCase()) || 
                          existingContent.includes(item.keyword.toLowerCase());

      if (!isAddressed) {
        gaps.push({
          gapId: `gap-${Date.now()}-${gaps.length + 1}`,
          topicCluster: item.cluster,
          suggestedTitle: item.title,
          primaryKeyword: item.keyword,
          secondaryKeywords: ['himalayas trek', 'outdoor adventure guide', 'trek planning'],
          searchIntent: item.intent,
          estimatedSearchVolume: item.intent === 'Transactional' ? 'High' : 'Medium',
          priority: item.intent === 'Transactional' || item.intent === 'Commercial' ? 'High' : 'Medium',
        });
      }
    }

    return gaps;
  }
}
