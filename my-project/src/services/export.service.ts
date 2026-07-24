import ExcelJS from 'exceljs';
import { ContentCalendarItem, ContentAuditReport } from '../models/calendar.model.js';

export class ExportService {
  /**
   * Converts a 10-field content calendar into standard CSV format
   */
  exportToCsv(calendar: ContentCalendarItem[]): string {
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

    const rows = calendar.map(item => [
      `"${item.publishDate}"`,
      `"${item.blogTitle.replace(/"/g, '""')}"`,
      `"${item.primaryKeyword.replace(/"/g, '""')}"`,
      `"${(item.secondaryKeywords || []).join(', ').replace(/"/g, '""')}"`,
      `"${item.searchIntent}"`,
      `"${item.targetAudience.replace(/"/g, '""')}"`,
      `"${item.contentType.replace(/"/g, '""')}"`,
      `"${item.linkToBlog}"`,
      `"${item.cta.replace(/"/g, '""')}"`,
      `"${item.priority}"`,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  /**
   * Converts audit report to pretty JSON
   */
  exportToJson(report: ContentAuditReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Generates a professionally formatted Excel (.xlsx) workbook compatible with Google Sheets & Excel
   * Features dynamic column widths, auto-wrapping text, and content-based row height auto-sizing.
   */
  async exportToExcel(calendar: ContentCalendarItem[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Content Calendar Audit Engine';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Content Calendar', {
      views: [{ showGridLines: true, state: 'frozen', ySplit: 1 }]
    });

    worksheet.columns = [
      { header: 'Publish Date', key: 'publishDate' },
      { header: 'Blog Title', key: 'blogTitle' },
      { header: 'Primary Keyword', key: 'primaryKeyword' },
      { header: 'Secondary Keywords', key: 'secondaryKeywords' },
      { header: 'Search Intent', key: 'searchIntent' },
      { header: 'Target Audience', key: 'targetAudience' },
      { header: 'Content Type', key: 'contentType' },
      { header: 'Link to Blog', key: 'linkToBlog' },
      { header: 'CTA', key: 'cta' },
      { header: 'Priority', key: 'priority' },
    ];

    // Header Row Styling
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }, // Dark Navy
      };
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF334155' } }
      };
    });

    // Populate Data Rows & Calculate dynamic text wrapping & row height
    calendar.forEach((item, index) => {
      const row = worksheet.addRow({
        publishDate: item.publishDate,
        blogTitle: item.blogTitle,
        primaryKeyword: item.primaryKeyword,
        secondaryKeywords: (item.secondaryKeywords || []).join(', '),
        searchIntent: item.searchIntent,
        targetAudience: item.targetAudience,
        contentType: item.contentType,
        linkToBlog: item.linkToBlog,
        cta: item.cta,
        priority: item.priority,
      });

      const isEvenRow = index % 2 === 1;
      const rowBgColor = isEvenRow ? 'FFF8FAFC' : 'FFFFFFFF';

      row.eachCell((cell, colNumber) => {
        // Base cell styling with mandatory wrapText
        cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1E293B' } };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowBgColor }
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };

        // Center alignment for specific columns
        if (colNumber === 1 || colNumber === 5 || colNumber === 7 || colNumber === 10) {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }

        // Priority Badge styling
        if (colNumber === 10) {
          const val = (item.priority || '').toUpperCase();
          if (val === 'HIGH') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E6' } };
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF9F1239' } };
          } else if (val === 'MEDIUM') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF92400E' } };
          } else if (val === 'LOW') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF065F46' } };
          }
        }
      });
    });

    // Auto-fit Column Widths based on text content length
    worksheet.columns.forEach((column) => {
      let maxLen = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const str = cell.value ? String(cell.value) : '';
        if (str.length > maxLen) {
          maxLen = str.length;
        }
      });
      // Clamp column width dynamically between 14 and 42 characters for aesthetic layout
      column.width = Math.min(Math.max(maxLen + 4, 14), 42);
    });

    // Calculate dynamic row height based on text content wrapping
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      let maxLinesInRow = 1;
      row.eachCell((cell, colIndex) => {
        const colWidth = (worksheet.getColumn(colIndex).width || 20) - 3;
        const text = cell.value ? String(cell.value) : '';
        const lines = Math.ceil(text.length / Math.max(colWidth, 1));
        if (lines > maxLinesInRow) {
          maxLinesInRow = lines;
        }
      });

      // Set row height based on line count with comfortable padding
      row.height = Math.max(26, maxLinesInRow * 18 + 6);
    });

    // Auto-filter across all columns
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: calendar.length + 1, column: 10 }
    };

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }
}

