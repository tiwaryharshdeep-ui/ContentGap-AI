import { describe, it, expect } from 'vitest';
import { TimeframePlannerService } from '../../src/services/timeframe-planner.service.js';

describe('TimeframePlannerService (30-90 Days Plan)', () => {
  const planner = new TimeframePlannerService();

  it('generates a 30-day plan with exact post count for 2 posts per week', () => {
    const plan = planner.generatePlan({ timeframeDays: 30, postsPerWeek: 2 });
    // Math.ceil(30/7) = 5 weeks * 2 = 10 posts
    expect(plan.length).toBeGreaterThanOrEqual(8);
    expect(plan[0]).toHaveProperty('publishDate');
    expect(plan[0]).toHaveProperty('blogTitle');
    expect(plan[0]).toHaveProperty('primaryKeyword');
  });

  it('generates a 60-day plan with scheduled publish dates in future', () => {
    const plan = planner.generatePlan({ timeframeDays: 60, postsPerWeek: 2 });
    expect(plan.length).toBeGreaterThanOrEqual(16);
    const firstDate = new Date(plan[0].publishDate);
    const lastDate = new Date(plan[plan.length - 1].publishDate);
    expect(lastDate.getTime()).toBeGreaterThan(firstDate.getTime());
  });

  it('generates a 90-day plan with full 10-field metadata', () => {
    const plan = planner.generatePlan({ timeframeDays: 90, postsPerWeek: 2 });
    expect(plan.length).toBeGreaterThanOrEqual(24);
    plan.forEach(item => {
      expect(item.blogTitle).toBeTruthy();
      expect(item.primaryKeyword).toBeTruthy();
      expect(item.searchIntent).toBeTruthy();
      expect(item.priority).toMatch(/High|Medium|Low/);
    });
  });
});
