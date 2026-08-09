# Product Manager Mission Report

**Agent**: product-manager  
**Generated**: 2026-08-09T20:26:37.217Z

---

## User Stories (15)

### US-001: As a new tenant user, I want to sign up and log in to the platform
- So that: I can access my tenant's analytics dashboard
- AC: User can register with email and password and receives a verification email; Registered user can log in and receives a JWT token stored in the SPA; Invalid credentials return an appropriate error response
### US-002: As a tenant admin, I want to manage users within my tenant
- So that: I can control who has access and what permissions they have
- AC: Admin can invite a new user by email and the invited user receives an invitation email with a signup link; Admin can assign Admin or Member role to existing users; Admin can remove a user and the removed user can no longer log in
### US-003: As a tenant admin, I want to generate and revoke API keys for my tenant
- So that: external services can securely send events on behalf of my tenant
- AC: Admin can generate a new API key that is displayed only once and stored securely; Admin can revoke an existing API key and any subsequent event ingestion with that key is rejected
### US-004: As a external client, I want to post events to the platform via a REST endpoint
- So that: my product usage data is captured for analysis
- AC: POST /api/events with a valid API key stores the event and returns HTTP 202; Payload validation errors return HTTP 400 with detailed error messages; Exceeding the per‑tenant rate limit returns HTTP 429
### US-005: As a tenant member, I want to view a pre‑built dashboard showing event volume over time
- So that: I can quickly see traffic trends
- AC: Dashboard displays a line chart of event count per hour for the last 24 hours; Data is refreshed daily via a materialized view that the background worker updates
### US-006: As a tenant member, I want to view active‑user metrics (DAU/WAU/MAU) in a dashboard
- So that: I can understand user engagement
- AC: Dashboard shows numeric values for DAU, WAU and MAU for the selected tenant; Values are derived from a daily refreshed materialized view
### US-007: As a tenant member, I want to build custom ad‑hoc queries through a visual query builder
- So that: I can explore any event data I need
- AC: User can select event name(s), time range, property filters and aggregation type and submit the query; Query results are displayed as both a chart and a data table
### US-008: As a tenant member, I want the backend to execute my ad‑hoc queries efficiently
- So that: I receive results quickly
- AC: Query Service returns correct aggregation results for the supplied parameters; Query execution for a 7‑day data set completes in under 3 seconds
### US-009: As a tenant member, I want to save a chart to a dashboard
- So that: I can build reusable reports
- AC: User can click “Save to Dashboard”, choose or create a dashboard, and the chart appears on that dashboard; Saved charts persist and load correctly when the dashboard page is revisited
### US-010: As a tenant member, I want to generate a read‑only share link for a dashboard within my tenant
- So that: colleagues can view the dashboard without editing it
- AC: User can generate a share link that encodes a tenant‑scoped read‑only token; Visiting the share link displays the dashboard in read‑only mode with no edit controls
### US-011: As a platform operator, I want per‑API‑key rate limiting enforced at the gateway
- So that: no tenant can overload the system with excessive requests
- AC: Each API key is limited to a configurable number of requests per minute and exceeding the limit returns HTTP 429; Rate‑limit counters reset correctly after the time window expires
### US-012: As a platform operator, I want strict tenant data isolation at the database layer
- So that: one tenant can never read or modify another tenant's data
- AC: All queries automatically filter by tenant_id and cross‑tenant data is never returned; Attempting to access another tenant's resources returns HTTP 403
### US-013: As a site reliability engineer, I want all services to emit OpenTelemetry traces and metrics
- So that: I can monitor performance and troubleshoot issues
- AC: Each service publishes traces that include request IDs and span across service boundaries; Metrics such as request latency, error count and queue depth are exported to OpenTelemetry
### US-014: As a site reliability engineer, I want Prometheus to scrape metrics and Grafana dashboards to visualise them
- So that: I have observability into system health
- AC: Prometheus successfully scrapes /metrics from every service; Grafana dashboards display latency, error rates and background‑worker queue depth
### US-999: As a end user, I want all components wired together so the application is fully functional
- So that: I can use the SaaS analytics platform from sign‑up to dashboard view without errors
- AC: Docker Compose starts all services and each reports healthy status; End‑to‑end flow (sign‑up → login → API‑key generation → event ingestion → pre‑built dashboard view) works without manual intervention; No unhandled exceptions appear in logs and the UI is fully interactive

## Tasks (35)

- **TASK-001** [infra/Git, npm workspaces] Initialize monorepo with backend and frontend directories
- **TASK-002** [infra/Docker Compose] Define Docker Compose services for all components
- **TASK-003** [infra/GitHub Actions, Docker] Configure GitHub Actions CI/CD pipeline
- **TASK-004** [frontend/React 18, TypeScript, Vite] Scaffold React SPA with Vite and TypeScript
- **TASK-005** [frontend/React, Axios, React Context] Implement authentication UI and token handling
- **TASK-006** [backend/Node.js 20, Express.js, Winston, OpenTelemetry SDK] Set up API Gateway with core middleware
- **TASK-007** [backend/Node.js, Express, Passport-JWT, bcrypt] Implement Auth Service with Passport‑JWT
- **TASK-008** [db/PostgreSQL 15, Flyway or db-migrate] Design PostgreSQL schema for tenants, users, roles, and API keys
- **TASK-009** [backend/Node.js, Express, PostgreSQL] Implement Tenant Management endpoints (sign‑up, invite, role assignment, list users)
- **TASK-010** [backend/SendGrid API, Node.js] Integrate SendGrid for invitation and password‑reset emails
- **TASK-011** [backend/Node.js, Express, PostgreSQL] Add API key generation and revocation endpoints
- **TASK-012** [backend/Node.js, Express, Zod] Create Event Ingestion endpoint with payload validation
- **TASK-013** [backend/Redis 7, ioredis] Add per‑tenant rate‑limit counters in Redis for ingestion endpoint
- **TASK-014** [db/PostgreSQL] Persist raw events to PostgreSQL events table
- **TASK-015** [backend/BullMQ, Redis] Enqueue aggregation job to BullMQ after event storage
- **TASK-016** [backend/Node.js, BullMQ, PostgreSQL] Implement Background Worker to process aggregation jobs
- **TASK-017** [db/PostgreSQL] Create materialized view for event volume per hour
- **TASK-018** [db/PostgreSQL] Create materialized view for active‑user metrics (DAU/WAU/MAU)
- **TASK-019** [backend/Node.js, Express, PostgreSQL] Implement Dashboard Service CRUD endpoints for dashboards and charts
- **TASK-020** [frontend/React, Recharts, Axios] Build React components for pre‑built dashboard pages
- **TASK-021** [backend/Node.js, Express, PostgreSQL] Implement Query Service endpoint for ad‑hoc aggregations
- **TASK-022** [frontend/React, TypeScript, React Hook Form] Develop Query Builder UI component
- **TASK-023** [frontend/React, Axios, Recharts, React Table] Integrate Query Builder with Query Service and display results
- **TASK-024** [backend/Node.js, Express, jsonwebtoken] Add endpoint to generate tenant‑scoped read‑only share links
- **TASK-025** [frontend/React, React Router, Axios] Create React component for rendering shared dashboards in read‑only mode
- **TASK-026** [backend/Express-rate-limit, Redis, Node.js] Add per‑API‑key rate limiting middleware at API Gateway level
- **TASK-027** [backend/Node.js, pg library, TypeScript] Enforce tenant_id filtering in all data‑access queries
- **TASK-028** [backend/OpenTelemetry SDK for Node.js] Instrument all services with OpenTelemetry SDK
- **TASK-029** [backend/prom-client, Node.js] Expose Prometheus metrics endpoint (/metrics) from each service
- **TASK-030** [infra/Grafana, Prometheus] Create Grafana dashboards for latency, error rates, and queue depth
- **TASK-031** [testing/Jest, supertest] Write Jest unit tests for Auth Service login and token verification
- **TASK-032** [testing/SuperTest, Jest] Write SuperTest integration tests for API Gateway routing and Auth middleware
- **TASK-033** [testing/Cypress] Create Cypress end‑to‑end tests for tenant sign‑up, login, and dashboard view
- **TASK-034** [testing/Jest, ioredis-mock] Write Jest tests for Event Ingestion validation and rate limiting logic
- **TASK-035** [testing/Jest, pg-test] Write Jest tests for Query Service aggregation correctness and performance bounds
