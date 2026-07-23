import { describe, it, expect } from 'vitest';
import { AuditService } from '../../src/services/audit.service.js';

describe('Domain Audit API Service Contract', () => {
  const auditService = new AuditService();

  it('runs domain audit and returns complete report matching data model', async () => {
    const report = await auditService.runDomainAudit('https://exampletrekking.com', 5);

    expect(report.auditId).toBeDefined();
    expect(report.domainUrl).toBe('https://exampletrekking.com');
    expect(report.totalPagesIndexed).toBeGreaterThan(0);
    expect(Array.isArray(report.contentGaps)).toBe(true);
    expect(Array.isArray(report.outdatedBlogs)).toBe(true);
    expect(Array.isArray(report.seasonalTrips)).toBe(true);
    expect(Array.isArray(report.faqOpportunities)).toBe(true);
    expect(Array.isArray(report.calendar)).toBe(true);

    // Verify 10 fields on calendar items
    for (const item of report.calendar) {
      expect(item.publishDate).toBeDefined();
      expect(item.blogTitle).toBeDefined();
      expect(item.primaryKeyword).toBeDefined();
      expect(item.searchIntent).toBeDefined();
      expect(item.targetAudience).toBeDefined();
      expect(item.contentType).toBeDefined();
      expect(item.linkToBlog).toBeDefined();
      expect(item.cta).toBeDefined();
      expect(item.priority).toBeDefined();
    }
  });
});
