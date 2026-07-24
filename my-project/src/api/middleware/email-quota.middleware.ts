import { Request, Response, NextFunction } from 'express';

export interface EmailUsageRecord {
  count: number;
  firstAccess: string;
  lastAccess: string;
}

// 7 Days in Milliseconds
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// In-memory store tracking data extractions per email
export const emailUsageStore = new Map<string, EmailUsageRecord>();

export function emailQuotaMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow export/download endpoints to proceed without blocking quota
  if (req.path.includes('/export') || req.path.includes('/export-markdown')) {
    return next();
  }

  // Extract email from headers, query params, or body
  const userEmail = 
    (req.headers['x-user-email'] as string) || 
    (req.query.user_email as string) || 
    (req.body && req.body.userEmail as string);

  if (!userEmail) {
    return res.status(400).json({
      error: 'Email Required',
      message: 'Data Access Restricted: Please enter a valid email address to extract data.',
    });
  }

  const cleanEmail = userEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      error: 'Invalid Email',
      message: 'Please provide a valid email format (e.g. name@example.com).',
    });
  }

  const record = emailUsageStore.get(cleanEmail);

  if (record) {
    const lastAccessTime = new Date(record.lastAccess).getTime();
    const now = Date.now();
    const timeElapsed = now - lastAccessTime;

    if (timeElapsed < ONE_WEEK_MS) {
      const remainingMs = ONE_WEEK_MS - timeElapsed;
      const daysLeft = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      const nextAvailableDate = new Date(lastAccessTime + ONE_WEEK_MS).toISOString().substring(0, 10);

      return res.status(429).json({
        error: 'Quota Exceeded',
        message: `Weekly Quota Exceeded: Email "${cleanEmail}" has already extracted data. Next access will be granted after 1 week on ${nextAvailableDate} (in approx ${daysLeft} day(s)).`,
        email: cleanEmail,
        lastUsedAt: record.lastAccess,
        nextAvailableDate,
        daysLeft
      });
    }
  }

  // Register or update weekly access timestamp
  emailUsageStore.set(cleanEmail, {
    count: (record?.count || 0) + 1,
    firstAccess: record?.firstAccess || new Date().toISOString(),
    lastAccess: new Date().toISOString(),
  });

  next();
}
