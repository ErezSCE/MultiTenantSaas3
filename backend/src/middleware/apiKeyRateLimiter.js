/**
 * API Key Rate Limiting Middleware using express-rate-limit with optional Redis store.
 *
 * Configuration via environment variables:
 *   RATE_LIMIT_MAX – maximum requests per window (default 100)
 *   RATE_LIMIT_WINDOW_MS – window size in ms (default 60000)
 *   USE_REDIS – if set to "true", uses Redis as the store; otherwise falls back to in‑memory store.
 *   REDIS_HOST, REDIS_PORT – Redis connection details (defaults to localhost:6379).
 *
 * The middleware expects the API key in the "x-api-key" header. Requests without this
 * header are not rate‑limited (they may be public endpoints). When the limit is exceeded,
 * a 429 response with a Retry-After header is returned.
 */

const rateLimit = require('express-rate-limit');
let RedisStore;
let redisClient;

if (process.env.USE_REDIS === 'true') {
  // Lazy‑load to avoid unnecessary dependency when not using Redis.
  RedisStore = require('rate-limit-redis');
  const Redis = require('ioredis');
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
  redisClient = new Redis({ host: redisHost, port: redisPort });
}

const DEFAULT_MAX = 100;
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute

function getConfig() {
  const max = parseInt(process.env.RATE_LIMIT_MAX, 10);
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);
  return {
    max: Number.isNaN(max) ? DEFAULT_MAX : max,
    windowMs: Number.isNaN(windowMs) ? DEFAULT_WINDOW_MS : windowMs,
  };
}

// Create the limiter instance.
// Compute configuration once to avoid multiple reads.
const { max, windowMs } = getConfig();

const limiter = rateLimit({
  windowMs,
  max,
  // Use only the API key as the identifier; requests without an API key are skipped.
  keyGenerator: (req) => req.header('x-api-key'),
  skip: (req) => !req.header('x-api-key'), // Skip if no API key provided.
  handler: (req, res) => {
    const now = Date.now();
    const resetTime = Math.ceil((req.rateLimit.resetTime - now) / 1000);
    res.set('Retry-After', resetTime);
    res.status(429).json({ error: 'Too Many Requests' });
  },
  // Use Redis store if enabled.
  store: process.env.USE_REDIS === 'true' ? new RedisStore({
    client: redisClient,
  }) : undefined,
});

module.exports = limiter;
