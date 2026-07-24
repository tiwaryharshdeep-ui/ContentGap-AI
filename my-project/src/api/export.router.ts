import { Router, Request, Response } from 'express';
import { ExportService } from '../services/export.service.js';
import { GSheetsService } from '../services/gsheets.service.js';
import { TimeframePlannerService } from '../services/timeframe-planner.service.js';
import { auditStore } from './audit.router.js';

export const exportRouter = Router();
const exportService = new ExportService();
const gsheetsService = new GSheetsService();

/**
 * GET /api/calendar/export?auditId=latest&format=csv|json|gsheets|excel|xlsx
 */
exportRouter.get('/export', async (req: Request, res: Response) => {
  const auditId = (req.query.auditId as string) || 'latest';
  const format = ((req.query.format as string) || 'csv').toLowerCase();

  let report = auditStore.get(auditId);
  if (!report && auditId !== 'latest') {
    report = auditStore.get('latest');
  }

  // Fallback: If no audit report has been generated yet, create a default plan report
  if (!report) {
    const timeframePlannerService = new TimeframePlannerService();
    const calendar = timeframePlannerService.generatePlan({
      timeframeDays: 30,
      postsPerWeek: 2,
      domainUrl: 'exampletrekking.com',
      previewMode: true,
    });
    report = {
      auditId: 'default-plan',
      domainUrl: 'exampletrekking.com',
      auditedAt: new Date().toISOString(),
      totalPagesIndexed: calendar.length,
      contentGaps: [],
      outdatedBlogs: [],
      seasonalTrips: [],
      faqOpportunities: [],
      calendar,
    };
    auditStore.set('latest', report);
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="content-calendar.json"');
    return res.send(exportService.exportToJson(report));
  } else if (format === 'gsheets') {
    const payload = gsheetsService.generateGSheetsPayload(report.calendar);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="google-sheets-payload.json"');
    return res.json(payload);
  } else if (format === 'excel' || format === 'xlsx') {
    const excelBuffer = await exportService.exportToExcel(report.calendar);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="content-calendar.xlsx"'
    );
    return res.send(excelBuffer);
  } else {
    // Default CSV export
    const csvContent = exportService.exportToCsv(report.calendar);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="content-calendar.csv"');
    return res.send(csvContent);
  }
});

