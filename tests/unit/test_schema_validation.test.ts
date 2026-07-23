import { describe, it, expect } from 'vitest';
import { ContentCalendarItemSchema } from '../../src/models/schema.js';

describe('10-Field Mandatory Metadata Schema Invariant', () => {
  it('passes validation when all 10 fields are present and valid', () => {
    const validItem = {
      publishDate: '2026-08-15',
      blogTitle: 'Complete Himalayan Winter Trekking Guide',
      primaryKeyword: 'himalayan winter trek',
      secondaryKeywords: ['snow trek', 'winter gear'],
      searchIntent: 'Informational',
      targetAudience: 'Adventure Seekers',
      contentType: 'Comprehensive Guide',
      linkToBlog: '/blog/himalayan-winter-trek',
      cta: 'Book Your Trek Now',
      priority: 'High',
    };

    const parsed = ContentCalendarItemSchema.parse(validItem);
    expect(parsed.publishDate).toBe('2026-08-15');
    expect(parsed.priority).toBe('High');
    expect(parsed.searchIntent).toBe('Informational');
  });

  it('fails validation when mandatory fields are missing', () => {
    const incompleteItem = {
      blogTitle: 'Incomplete Post',
      primaryKeyword: 'test',
    };

    expect(() => ContentCalendarItemSchema.parse(incompleteItem)).toThrow();
  });

  it('fails validation when publishDate format is invalid', () => {
    const invalidDateItem = {
      publishDate: '15/08/2026', // Wrong format
      blogTitle: 'Title Test',
      primaryKeyword: 'test',
      secondaryKeywords: [],
      searchIntent: 'Informational',
      targetAudience: 'Everyone',
      contentType: 'Blog',
      linkToBlog: '/test',
      cta: 'Click',
      priority: 'Medium',
    };

    expect(() => ContentCalendarItemSchema.parse(invalidDateItem)).toThrow();
  });
});
