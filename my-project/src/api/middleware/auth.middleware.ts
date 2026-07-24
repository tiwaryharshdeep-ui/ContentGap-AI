import { Request, Response, NextFunction } from 'express';

export function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const expectedApiKey = process.env.API_KEY || 'my_secret_api_key_2026';

  // Allow same-origin requests from the built-in Web UI Dashboard without requiring client-side API key exposure
  const host = req.headers.host;
  const referer = req.headers.referer;
  const origin = req.headers.origin;

  if (host && ((referer && referer.includes(host)) || (origin && origin.includes(host)))) {
    return next();
  }

  // Extract key from x-api-key header, authorization header, or query param
  const headerKey = req.headers['x-api-key'] as string;
  const authHeader = req.headers['authorization'];
  const queryKey = req.query.api_key as string;

  let providedKey = headerKey || queryKey;

  if (!providedKey && authHeader && authHeader.startsWith('Bearer ')) {
    providedKey = authHeader.substring(7).trim();
  }

  if (!providedKey || providedKey !== expectedApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API Key. Provide "x-api-key" header or "?api_key=" query parameter.',
    });
  }

  next();
}
