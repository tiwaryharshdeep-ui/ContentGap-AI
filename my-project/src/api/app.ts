import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { auditRouter } from './audit.router.js';
import { calendarRouter } from './calendar.router.js';
import { exportRouter } from './export.router.js';
import { blogRouter } from './blog.router.js';
import { apiKeyAuthMiddleware } from './middleware/auth.middleware.js';
import { emailQuotaMiddleware } from './middleware/email-quota.middleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Apply API Key Authentication Middleware & Email Quota Middleware to all API routes
  app.use('/api', apiKeyAuthMiddleware);
  app.use('/api', emailQuotaMiddleware);

  // Mount API Routers
  app.use('/api/audit', auditRouter);
  app.use('/api/calendar', calendarRouter);
  app.use('/api/calendar', exportRouter);
  app.use('/api/blog', blogRouter);

  // Serve Frontend Visual Dashboard UI
  const frontendPath = path.resolve(__dirname, '../frontend');
  app.use(express.static(frontendPath));
  
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'Content Calendar & Audit Engine', timestamp: new Date().toISOString() });
  });

  // Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('API Error:', err.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  });

  return app;
}
