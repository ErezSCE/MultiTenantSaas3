// Tests for backend Express app
const request = require('supertest');

describe('Express app routes', () => {
  let app;

  beforeAll(() => {
    // Ensure test environment is set before requiring the app
    process.env.NODE_ENV = 'test';
    app = require('../src/app');
  });

  test('GET /health should return status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /error should trigger error handling and return 500', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal Server Error');
  });
});
