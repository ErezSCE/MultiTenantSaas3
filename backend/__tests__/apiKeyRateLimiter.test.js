const request = require('supertest');

// Set environment variables before loading the app to configure the rate limiter.
process.env.RATE_LIMIT_MAX = '2'; // allow 2 requests per window
process.env.RATE_LIMIT_WINDOW_MS = '1000'; // 1 second window
process.env.USE_REDIS = 'false'; // use in‑memory store for tests

const app = require('../src/app');

describe('API Key Rate Limiter Middleware', () => {
  const apiKey = 'test-api-key';

  test('allows requests up to the limit and then returns 429 with Retry-After', async () => {
    // First request – should pass
    const res1 = await request(app)
      .get('/health')
      .set('x-api-key', apiKey);
    expect(res1.status).toBe(200);

    // Second request – should also pass (limit is 2)
    const res2 = await request(app)
      .get('/health')
      .set('x-api-key', apiKey);
    expect(res2.status).toBe(200);

    // Third request – should be rate‑limited
    const res3 = await request(app)
      .get('/health')
      .set('x-api-key', apiKey);
    expect(res3.status).toBe(429);
    expect(res3.body).toHaveProperty('error', 'Too Many Requests');
    expect(res3.headers).toHaveProperty('retry-after');
  });

  test('requests without an API key are not rate‑limited', async () => {
    // Send multiple requests without the x-api-key header; all should succeed.
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    }
  });
});
