import { z } from 'zod';

export const SearchIntentEnum = z.enum(['Informational', 'Commercial', 'Transactional', 'Navigational']);
export type SearchIntent = z.infer<typeof SearchIntentEnum>;

export const PriorityLevelEnum = z.enum(['High', 'Medium', 'Low']);
export type PriorityLevel = z.infer<typeof PriorityLevelEnum>;

export const SourceTypeEnum = z.enum([
  'AuditGap',
  'AuditOutdated',
  'AuditSeasonal',
  'AuditFAQ',
  'ManualPost',
]);
export type SourceType = z.infer<typeof SourceTypeEnum>;

/**
 * 10-Field Mandatory Content Calendar Metadata Schema
 */
export const ContentCalendarItemSchema = z.object({
  id: z.string().optional(),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Publish date must be in YYYY-MM-DD format'),
  blogTitle: z.string().min(3, 'Blog title must be at least 3 characters long'),
  primaryKeyword: z.string().min(2, 'Primary keyword is required'),
  secondaryKeywords: z.array(z.string()).default([]),
  searchIntent: SearchIntentEnum,
  targetAudience: z.string().min(2, 'Target audience is required'),
  contentType: z.string().min(2, 'Content type is required'),
  linkToBlog: z.string().min(1, 'Link to blog is required'),
  cta: z.string().min(2, 'CTA is required'),
  priority: PriorityLevelEnum,
  sourceType: SourceTypeEnum.optional().default('ManualPost'),
});

export type ContentCalendarItemInput = z.infer<typeof ContentCalendarItemSchema>;
