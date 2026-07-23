import { SearchIntent, PriorityLevel } from '../models/schema.js';

export interface PriorityContext {
  searchIntent: SearchIntent;
  stalenessDays?: number;
  hasOutdatedYearTitle?: boolean;
  isSeasonalLeadWindow?: boolean; // 60-90 days lead time
  commercialIntent?: boolean;
}

export class PriorityEngine {
  /**
   * Deterministically calculates priority (High, Medium, Low) based on intent, staleness, and seasonal lead time
   */
  calculatePriority(ctx: PriorityContext): PriorityLevel {
    // High Priority Triggers
    if (ctx.isSeasonalLeadWindow) {
      return 'High';
    }

    if (ctx.hasOutdatedYearTitle || (ctx.stalenessDays && ctx.stalenessDays > 365)) {
      return 'High';
    }

    if (ctx.searchIntent === 'Transactional' || ctx.searchIntent === 'Commercial') {
      return 'High';
    }

    // Medium Priority Triggers
    if (ctx.searchIntent === 'Informational') {
      if (ctx.stalenessDays && ctx.stalenessDays > 180) {
        return 'High';
      }
      return 'Medium';
    }

    // Low Priority Fallback
    return 'Low';
  }
}
