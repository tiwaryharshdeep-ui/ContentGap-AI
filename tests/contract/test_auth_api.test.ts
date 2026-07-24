import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/api/app.js';

describe('API Key Authentication & Email Quota Middleware', () => {
  const app = createApp();

  it('rejects requests without API key with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/calendar/generate-timeframe')
      .send({ timeframeDays: 30 });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('accepts requests with valid x-api-key header and unique user email', async () => {
    const res = await request(app)
      .post('/api/calendar/generate-timeframe')
      .set('x-api-key', process.env.API_KEY || 'my_secret_api_key_2026')
      .set('x-user-email', 'testuser1@example.com')
      .send({ timeframeDays: 30 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('calendar');
  });

  it('blocks duplicate extraction requests using the same email address', async () => {
    // Second request with same email testuser1@example.com
    const res = await request(app)
      .post('/api/calendar/generate-timeframe')
      .set('x-api-key', process.env.API_KEY || 'my_secret_api_key_2026')
      .set('x-user-email', 'testuser1@example.com')
      .send({ timeframeDays: 30 });

    expect(res.status).toBe(429);
    expect(res.body.error).toBe('Quota Exceeded');
  });

  it('accepts requests with valid api_key and unique user_email query parameter', async () => {
    const key = process.env.API_KEY || 'my_secret_api_key_2026';
    const res = await request(app)
      .get(`/api/calendar/export?auditId=latest&format=json&api_key=${key}&user_email=exportuser@example.com`);

    expect(res.status).toBe(200);
  });
});
