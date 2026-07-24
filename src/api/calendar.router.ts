import { Router, Request, Response } from 'express';
import { EnrichmentService } from '../services/enrichment.service.js';
import { TimeframePlannerService } from '../services/timeframe-planner.service.js';
import { auditStore } from './audit.router.js';

export const calendarRouter = Router();
const enrichmentService = new EnrichmentService();
const timeframePlannerService = new TimeframePlannerService();

/**
 * POST /api/calendar/generate-from-posts
 * Enriches raw post titles/concepts into full 10-field content calendar items
 */
calendarRouter.post('/generate-from-posts', (req: Request, res: Response) => {
  try {
    const { posts } = req.body;
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ error: 'Body must contain a "posts" array with at least one item' });
    }

    const calendar = enrichmentService.enrichPosts(posts);

    // Save enriched calendar to store
    const report = {
      auditId: `custom-posts-${Date.now()}`,
      domainUrl: 'custom-input',
      auditedAt: new Date().toISOString(),
      totalPagesIndexed: posts.length,
      contentGaps: [],
      outdatedBlogs: [],
      seasonalTrips: [],
      faqOpportunities: [],
      calendar,
    };

    auditStore.set(report.auditId, report);
    auditStore.set('latest', report);

    res.status(200).json({ calendar });
  } catch (error: any) {
    res.status(500).json({ error: 'Post Enrichment Failed', message: error.message });
  }
});

/**
 * POST /api/calendar/generate-timeframe
 * Generates a full content schedule for the next 30, 60, or 90 days
 */
calendarRouter.post('/generate-timeframe', (req: Request, res: Response) => {
  try {
    const { timeframeDays = 30, postsPerWeek = 2, domainUrl = 'custom-plan', previewMode = true } = req.body;

    const validDays = [30, 60, 90].includes(Number(timeframeDays)) ? Number(timeframeDays) as 30 | 60 | 90 : 30;

    const calendar = timeframePlannerService.generatePlan({
      timeframeDays: validDays,
      postsPerWeek: Number(postsPerWeek) || 2,
      domainUrl,
      previewMode: previewMode !== false,
    });

    const report = {
      auditId: `plan-${validDays}d-${Date.now()}`,
      domainUrl,
      auditedAt: new Date().toISOString(),
      totalPagesIndexed: calendar.length,
      contentGaps: [],
      outdatedBlogs: [],
      seasonalTrips: [],
      faqOpportunities: [],
      calendar,
    };

    auditStore.set(report.auditId, report);
    auditStore.set('latest', report);

    res.status(200).json({ auditId: report.auditId, timeframeDays: validDays, count: calendar.length, calendar });
  } catch (error: any) {
    res.status(500).json({ error: 'Timeframe Plan Generation Failed', message: error.message });
  }
});

