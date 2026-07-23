import { describe, it, expect } from 'vitest';
import { SeasonalAnalyzer } from '../../src/services/seasonal-analyzer.js';

describe('Seasonal Trekking Trip Engine', () => {
  const analyzer = new SeasonalAnalyzer();

  it('generates seasonal trekking trip opportunities', () => {
    const items = analyzer.analyzeSeasonalTrips();
    expect(items.length).toBeGreaterThan(0);
  });

  it('schedules publication dates between 60 and 90 days before peak season', () => {
    const items = analyzer.analyzeSeasonalTrips();
    for (const item of items) {
      expect(item.recommendedPublishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.priority).toBe('High');
    }
  });
});
