# ⚖️ Barristrly Database Architecture

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Last Updated: July 2026

---

# Purpose

This document defines the architectural principles governing the Barristrly database.

It establishes:

- Database architecture
- Multi-tenancy strategy
- Data ownership
- Security model
- Naming conventions
- Relationships
- Performance standards
- Scalability strategy
- Migration policy
- Backup strategy

This document intentionally does **not** define individual tables or columns. Those are specified in `DATABASE_SCHEMA.md`.

---

# Database Philosophy

The database is the single source of truth for all persistent business data.

Every schema decision must prioritize:

- Data integrity
- Security
- Scalability
- Performance
- Maintainability
- Auditability
- AI compatibility

---

# Database Technology

## Primary Database

PostgreSQL

Reason:

- ACID compliant
- Enterprise-grade
- Excellent indexing
- JSONB support
- Full-text search
- Mature ecosystem
- Strong Supabase integration

---

## Platform

Supabase

Provides:

- Managed PostgreSQL
- Authentication
- Row-Level Security
- Storage
- Realtime
- Edge Functions
- Backups

---

# Database Design Principles

Every table must satisfy:

- Single responsibility
- Third Normal Form (3NF) by default
- Predictable naming
- Minimal duplication
- Explicit relationships
- Consistent timestamps
- Audit support

Denormalization should only be introduced after measuring performance bottlenecks.

---

# Multi-Tenancy Strategy

Barristrly is a **shared-database, shared-schema** multi-tenant SaaS.

Each record belongs to a tenant.

Typical ownership chain:

```

Tenant
└── Users
├── Lawyers
├── Clients
├── Meetings
├── CRM
├── Payments
├── Documents

```

Every tenant must be logically isolated through Row-Level Security (RLS).

No tenant should ever access another tenant’s data.

---

# Primary Keys

Every table must use:

```sql
uuid
```

Example:

```sql
id UUID PRIMARY KEY
```

Reasons:

- Globally unique
- Safe for distributed systems
- Prevents sequential ID enumeration
- Easier replication

Auto-incrementing integers are prohibited for primary business entities.

---

# Foreign Keys

All relationships must enforce referential integrity.

Example:

```sql
meeting.client_id
→ clients.id
```

Foreign key constraints must not be omitted without documented justification.

---

# Naming Conventions

## Tables

Plural

snake_case

Examples:

```
users
lawyers
clients
meetings
payments
subscriptions
```

---

## Columns

snake_case

Examples:

```
created_at
updated_at
deleted_at
first_name
phone_number
```

---

## Foreign Keys

```
client_id
lawyer_id
tenant_id
meeting_id
```

Always reference the singular entity name followed by `_id`.

---

## Join Tables

Alphabetical order.

Examples:

```
lawyer_specialties
meeting_documents
client_tags
```

---

# Standard Columns

Every business table must contain:

```sql
id
created_at
updated_at
created_by
updated_by
```

Soft-deletable tables must additionally contain:

```sql
deleted_at
deleted_by
```

---

# Audit Strategy

Critical business events must be auditable.

Examples:

- Login
- Payments
- Subscription changes
- Profile approval
- Lawyer verification
- Permission changes
- AI recommendations
- Document uploads

Audit records must never be physically deleted.

---

# Soft Delete Policy

Business entities should use soft deletes.

Example:

```sql
deleted_at TIMESTAMP NULL
```

Benefits:

- Recovery
- Compliance
- Auditability
- Historical reporting

Permanent deletion should be restricted to maintenance operations and legal compliance requirements.

---

# Timestamps

All timestamps must be stored in UTC.

Display conversion should occur in the application layer.

Never store local time zones in database timestamps.

---

# Relationships

Preferred relationship types:

- One-to-One
- One-to-Many
- Many-to-Many (via join tables)

Avoid storing arrays of foreign keys.

Always model explicit relationships.

---

# JSON Usage

JSONB is permitted only for:

- AI metadata
- Provider responses
- Dynamic settings
- Flexible configuration

Business-critical structured data must remain relational.

---

# Indexing Strategy

Indexes must be created for:

- Primary keys
- Foreign keys
- Frequently filtered columns
- Search fields
- Status columns
- Tenant identifiers
- Unique constraints

Composite indexes should reflect real query patterns.

Indexes should be reviewed periodically to remove unused ones.

---

# Search Strategy

Version 1:

- PostgreSQL Full-Text Search

Future:

- OpenSearch / Elasticsearch

Search indexes should remain synchronized through background jobs.

---

# Transactions

Use database transactions whenever multiple operations must succeed or fail together.

Examples:

- Booking creation
- Payment processing
- Subscription activation
- Lawyer onboarding

Partial writes are unacceptable for transactional workflows.

---

# Constraints

Use database constraints whenever possible.

Examples:

- NOT NULL
- CHECK
- UNIQUE
- FOREIGN KEY

Business rules should not rely solely on application code.

---

# Row-Level Security (RLS)

RLS is mandatory for all user-facing tables.

Every policy must be:

- Explicit
- Least privilege
- Reviewed during code review

Policies should be documented separately in `RLS_POLICIES.md`.

---

# Performance Standards

Target goals:

- Simple queries: <100 ms
- Complex queries: <300 ms
- Dashboard aggregations: <500 ms

Avoid N+1 query patterns.

Use pagination for large datasets.

---

# Partitioning Strategy

Initial release:

No partitioning.

Future candidates:

- Audit logs
- Notifications
- AI conversations
- Analytics events

Partitioning decisions must be data-driven.

---

# Caching Strategy

Do not cache authoritative business data inside PostgreSQL.

Application caching should use Redis.

Suitable cache targets:

- AI responses
- Search results
- Dashboard metrics
- Session data
- Feature flags

---

# File Storage

Binary files must not be stored inside PostgreSQL.

Use Supabase Storage for:

- Documents
- Images
- Videos
- Audio
- Meeting recordings

Only metadata and references belong in the database.

---

# Migrations

Schema changes must occur through version-controlled migrations.

Rules:

- One logical change per migration
- Never edit historical migrations
- Test on staging before production
- Provide rollback guidance when feasible

Manual schema changes in production are prohibited.

---

# Backup Strategy

Production database:

- Daily automated backups
- Point-in-time recovery (PITR)
- Off-site backup retention
- Regular restore testing

Backups should be encrypted and access-controlled.

---

# Data Retention

Retention periods should be defined by data category.

Examples:

- Audit logs
- Financial records
- AI conversations
- Meeting recordings

Deletion policies must comply with applicable legal and contractual requirements.

---

# AI Data Strategy

AI-generated content should be stored separately from source data.

Examples:

- Conversation summaries
- Recommendations
- Embeddings
- Classification results

AI outputs should be traceable to their originating records.

---

# Security Standards

The database must enforce:

- Encryption at rest
- TLS in transit
- Row-Level Security
- Principle of least privilege
- Strong authentication
- Secret rotation
- Audit logging

Sensitive fields should be encrypted where appropriate.

---

# Monitoring

Continuously monitor:

- Slow queries
- Lock contention
- Index usage
- Connection count
- Storage growth
- Replication health
- Backup status

Alerts should be configured for critical thresholds.

---

# Documentation Requirements

Every table must have documentation covering:

- Purpose
- Ownership
- Relationships
- Constraints
- Indexes
- Security considerations

No table should exist without corresponding documentation.

---

# Success Criteria

The database architecture must:

✓ Maintain strict tenant isolation

✓ Preserve data integrity

✓ Scale with platform growth

✓ Support enterprise security

✓ Enable efficient querying

✓ Be straightforward for engineers and AI assistants to understand

✓ Minimize future schema refactoring

This document defines the architectural foundation for all database design decisions across Barristrly.