-- Migration: Create materialized view for active user metrics (DAU, WAU, MAU)
-- This view is refreshed daily to provide active user counts per tenant.

CREATE MATERIALIZED VIEW IF NOT EXISTS active_user_metrics AS
SELECT
    e.tenant_id,
    CURRENT_DATE AS metric_date,
    COUNT(DISTINCT (e.payload->>'user_id')) FILTER (WHERE e.received_at >= CURRENT_DATE) AS dau,
    COUNT(DISTINCT (e.payload->>'user_id')) FILTER (WHERE e.received_at >= CURRENT_DATE - INTERVAL '6 days') AS wau,
    COUNT(DISTINCT (e.payload->>'user_id')) FILTER (WHERE e.received_at >= CURRENT_DATE - INTERVAL '29 days') AS mau
FROM events e
WHERE e.event_type = 'login'
GROUP BY e.tenant_id;

-- Index to speed up refresh queries
CREATE INDEX IF NOT EXISTS idx_active_user_metrics_tenant_id ON active_user_metrics (tenant_id);
