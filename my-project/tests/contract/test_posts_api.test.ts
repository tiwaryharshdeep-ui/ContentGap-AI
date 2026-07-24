import { describe, it, expect } from 'vitest';
import { EnrichmentService } from '../../src/services/enrichment.service.js';

describe('Custom Post Enrichment API Contract', () => {
  const service = new EnrichmentService();

  it('enriches raw post concepts into full 10-field calendar items', () => {
    const rawPosts = [
      { title: 'Top 10 High Altitude Trekking Boots', primaryKeyword: 'trekking boots review' },
      { title: 'Kedarkantha Winter Snow Trek', targetAudience: 'Beginner Trekkers' },
    ];

    const calendar = service.enrichPosts(rawPosts);
    expect(calendar.length).toBe(2);
    expect(calendar[0].blogTitle).toBe('Top 10 High Altitude Trekking Boots');
    expect(calendar[0].searchIntent).toBe('Commercial');
    expect(calendar[1].targetAudience).toBe('Beginner Trekkers');
  });
});
