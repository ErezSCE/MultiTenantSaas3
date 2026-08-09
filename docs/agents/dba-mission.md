# DBA Mission Report

**Agent**: dba  
**Generated**: 2026-08-09T20:27:12.874Z

---

## Database Engine: PostgreSQL 15

PostgreSQL provides strong relational capabilities, native JSONB support for flexible event payloads, built‑in materialized views for pre‑aggregations, and robust ACID guarantees needed for multi‑tenant isolation. It aligns with the tech stack decision and supports horizontal scaling via read replicas when needed.

## Entities (11)

- **tenants**: 4 columns
- **users**: 9 columns
- **roles**: 6 columns
- **user_roles**: 4 columns
- **api_keys**: 8 columns
- **events**: 6 columns
- **aggregation_jobs**: 9 columns
- **dashboards**: 7 columns
- **saved_queries**: 7 columns
- **charts**: 8 columns
- **share_links**: 6 columns

## ERD

```mermaid
erDiagram
    TENANTS ||--o{ USERS : "has"
    TENANTS ||--o{ ROLES : "defines"
    USERS ||--o{ USER_ROLES : "assigned"
    ROLES ||--o{ USER_ROLES : "assigned to"
    TENANTS ||--o{ API_KEYS : "issues"
    TENANTS ||--o{ EVENTS : "generates"
    TENANTS ||--o{ DASHBOARDS : "owns"
    DASHBOARDS ||--o{ CHARTS : "contains"
    TENANTS ||--o{ SAVED_QUERIES : "creates"
    SAVED_QUERIES ||--o{ CHARTS : "used by"
    DASHBOARDS ||--o{ SHARE_LINKS : "shares"
    TENANTS ||--o{ AGGREGATION_JOBS : "queues"
    USERS {
        UUID id PK
        UUID tenant_id FK
        VARCHAR email
        VARCHAR password_hash
        VARCHAR first_name
        VARCHAR last_name
        BOOLEAN is_active
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    TENANTS {
        UUID id PK
        VARCHAR name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    ROLES {
        UUID id PK
        UUID tenant_id FK
        VARCHAR name
        TEXT description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    USER_ROLES {
        UUID user_id PK,FK
        UUID role_id PK,FK
        TIMESTAMP assigned_at
    }
    API_KEYS {
        UUID id PK
        UUID tenant_id FK
        VARCHAR key_hash
        VARCHAR name
        BOOLEAN is_active
        TIMESTAMP revoked_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    EVENTS {
        BIGSERIAL id PK
        UUID tenant_id FK
        VARCHAR event_type
        JSONB payload
        TIMESTAMP received_at
        TIMESTAMP created_at
    }
    DASHBOARDS {
        UUID id PK
        UUID tenant_id FK
        VARCHAR name
        TEXT description
        BOOLEAN is_public
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    SAVED_QUERIES {
        UUID id PK
        UUID tenant_id FK
        VARCHAR name
        TEXT description
        JSONB query_definition
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    CHARTS {
        UUID id PK
        UUID dashboard_id FK
        VARCHAR title
        VARCHAR chart_type
        UUID saved_query_id FK
        INTEGER position
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    SHARE_LINKS {
        UUID id PK
        UUID dashboard_id FK
        VARCHAR token
        TIMESTAMP expires_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    AGGREGATION_JOBS {
        UUID id PK
        UUID tenant_id FK
        VARCHAR job_type
        VARCHAR status
        TIMESTAMP scheduled_at
        TIMESTAMP started_at
        TIMESTAMP finished_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```
