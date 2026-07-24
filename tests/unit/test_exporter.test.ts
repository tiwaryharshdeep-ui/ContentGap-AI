import { describe, it, expect } from 'vitest';
import { ExportService } from '../../src/services/export.service.js';
import { ContentCalendarItem } from '../../src/models/calendar.model.js';

describe('CSV & JSON Export Service', () => {
  const exportService = new ExportService();

  const mockCalendar: ContentCalendarItem[] = [
    {
      id: 'cal-1',
      publishDate: '2026-08-01',
      blogTitle: 'Kedarkantha Trek Guide',
      primaryKeyword: 'kedarkantha trek',
      secondaryKeywords: ['snow trek', 'himalayas'],
      searchIntent: 'Informational',
      targetAudience: 'Trekkers',
      contentType: 'Guide',
      linkToBlog: '/blog/kedarkantha',
      cta: 'Book Trek',
      priority: 'High',
    },
  ];

  it('formats calendar array into CSV with exact 10 headers', () => {
    const csv = exportService.exportToCsv(mockCalendar);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Publish Date,Blog Title,Primary Keyword,Secondary Keyword,Search Intent,Target Audience,Content Type,Link to Blog,CTA,Priority');
    expect(lines[1]).toContain('Kedarkantha Trek Guide');
  });

  it('generates non-empty Excel buffer for calendar export', async () => {
    const excelBuffer = await exportService.exportToExcel(mockCalendar);
    expect(Buffer.isBuffer(excelBuffer)).toBe(true);
    expect(excelBuffer.length).toBeGreaterThan(1000);
  });
});
