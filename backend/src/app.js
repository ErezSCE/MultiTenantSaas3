const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const apiKeyRateLimiter = require('./middleware/apiKeyRateLimiter');
// Initialize OpenTelemetry tracing (side-effect import)
require('./tracing');

// Initialize Express app
const app = express();

// Core middleware
app.use(express.json()); // JSON body parsing
app.use(cors()); // Enable CORS for all origins (adjust in production)
// Apply API key rate limiting middleware globally
app.use(apiKeyRateLimiter);

// Winston request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});


// Test route to trigger an error (only in test environment)
if (process.env.NODE_ENV === 'test') {
  app.get('/error', (req, res, next) => {
    next(new Error('test error'));
  });
}

// Simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err, stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
