// Tenant Isolation Middleware
// Extracts tenant identifier from request headers and attaches it to the request object.
// If the tenant ID is missing, the request is rejected with a 400 Bad Request.

/**
 * Express middleware to enforce tenant isolation.
 * Expected header: X-Tenant-ID (case-insensitive).
 */
function tenantIsolation(req, res, next) {
  const tenantId = req.header('x-tenant-id');
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }
  // Attach tenantId to request for downstream handlers.
  req.tenantId = tenantId;
  next();
}

module.exports = tenantIsolation;
