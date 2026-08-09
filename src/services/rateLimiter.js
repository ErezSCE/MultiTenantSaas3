// src/services/rateLimiter.js
// Simple RateLimiter using ioredis (or a compatible client)

class RateLimiter {
  /**
   * @param {object} redisClient - ioredis client with incr and expire methods
   * @param {number} limit - max number of requests per window
   * @param {number} windowSeconds - time window in seconds
   */
  constructor(redisClient, limit = 5, windowSeconds = 60) {
    this.redis = redisClient;
    this.limit = limit;
    this.windowSeconds = windowSeconds;
  }

  /**
   * Checks and updates the rate limit counter for a tenant.
   * Throws an error with name 'RateLimitExceeded' if limit is exceeded.
   * @param {string} tenantId
   */
  async checkLimit(tenantId) {
    const key = `rate:${tenantId}`;
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, this.windowSeconds);
    }
    if (count > this.limit) {
      const err = new Error('Rate limit exceeded');
      err.name = 'RateLimitExceeded';
      throw err;
    }
  }
}

module.exports = { RateLimiter };
