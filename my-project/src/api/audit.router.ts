import { Router, Request, Response } from 'express';
import { AuditService } from '../services/audit.service.js';
import { FAQAnalyzer } from '../services/faq-analyzer.js';

export const auditRouter = Router();
const auditService = new AuditService();
const faqAnalyzer = new FAQAnalyzer();

// Memory store for recent audits
export const auditStore = new Map<string, any>();

/**
 * POST /api/audit/domain
 * Audits a target website domain or sitemap
 */
auditRouter.post('/domain', async (req: Request, res: Response) => {
  try {
    const { domainUrl, maxPages } = req.body;
    if (!domainUrl) {
      return res.status(400).json({ error: 'Missing required field: domainUrl' });
    }

    const report = await auditService.runDomainAudit(domainUrl, maxPages || 50);
    auditStore.set(report.auditId, report);
    auditStore.set('latest', report);

    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ error: 'Domain Audit Failed', message: error.message });
  }
});

/**
 * POST /api/audit/traffic-questions
 * Generates organic search traffic questions, featured snippet outlines, and JSON-LD FAQ schema
 */
auditRouter.post('/traffic-questions', (req: Request, res: Response) => {
  try {
    const { queryOrDomain } = req.body;
    const target = queryOrDomain || 'exampletrekking.com';
    const result = faqAnalyzer.generateTrafficQuestions(target);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Traffic Questions Generation Failed', message: error.message });
  }
});

/**
 * GET /api/audit/:auditId
 */
auditRouter.get('/:auditId', (req: Request, res: Response) => {
  const auditId = req.params.auditId || 'latest';
  const report = auditStore.get(auditId);
  if (!report) {
    return res.status(404).json({ error: 'Audit report not found' });
  }
  res.json(report);
});
