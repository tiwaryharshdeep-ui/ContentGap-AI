import { ContentCalendarItem } from '../models/calendar.model.js';

export interface GSheetsPayload {
  range: string;
  majorDimension: 'ROWS';
  values: string[][];
}

export class GSheetsService {
  /**
   * Generates a 2D matrix payload formatted for Google Sheets update/append operations
   */
  generateGSheetsPayload(calendar: ContentCalendarItem[]): GSheetsPayload {
    const headers = [
      'Publish Date',
      'Blog Title',
      'Primary Keyword',
      'Secondary Keyword',
      'Search Intent',
      'Target Audience',
      'Content Type',
      'Link to Blog',
      'CTA',
      'Priority',
    ];

    const dataRows = calendar.map(item => [
      item.publishDate,
      item.blogTitle,
      item.primaryKeyword,
      (item.secondaryKeywords || []).join(', '),
      item.searchIntent,
      item.targetAudience,
      item.contentType,
      item.linkToBlog,
      item.cta,
      item.priority,
    ]);

    return {
      range: 'ContentCalendar!A1:J' + (calendar.length + 1),
      majorDimension: 'ROWS',
      values: [headers, ...dataRows],
    };
  }
}
