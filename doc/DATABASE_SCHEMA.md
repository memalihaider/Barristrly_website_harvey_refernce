# ⚖️ Barristrly Database Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Last Updated: July 2026

---

# Purpose

This document is the master index for the Barristrly database.

It defines:

- Domain boundaries
- Shared conventions
- Cross-domain relationships
- Global enums
- Common columns
- Schema governance

Detailed table definitions are maintained in dedicated schema documents.

---

# Database Domains

The Barristrly database is divided into business domains.

Each domain owns its own tables and business rules.

```

Authentication
↓

Users
↓

Marketplace
↓

Bookings
↓

Meetings
↓

CRM
↓

Payments
↓

Subscriptions
↓

Accounting
↓

AI
↓

Notifications
↓

Analytics

```

No domain should directly manipulate another domain's tables outside approved APIs or services.

---

# Domain Documents

| Domain | Document |
|---------|----------|
| Authentication | AUTH_SCHEMA.md |
| Users | USER_SCHEMA.md |
| Marketplace | MARKETPLACE_SCHEMA.md |
| Booking | BOOKING_SCHEMA.md |
| Meetings | MEETING_SCHEMA.md |
| CRM | CRM_SCHEMA.md |
| Accounting | ACCOUNTING_SCHEMA.md |
| Payments | PAYMENT_SCHEMA.md |
| Subscription | SUBSCRIPTION_SCHEMA.md |
| AI | AI_SCHEMA.md |
| Notifications | NOTIFICATION_SCHEMA.md |
| Analytics | ANALYTICS_SCHEMA.md |
| Settings | SETTINGS_SCHEMA.md |
| Storage | STORAGE_SCHEMA.md |
| Audit | AUDIT_SCHEMA.md |

---

# Global Naming Convention

Tables

```
plural_snake_case
```

Examples

```
users
lawyers
clients
meetings
payments
```

Columns

```
snake_case
```

Foreign Keys

```
user_id
lawyer_id
meeting_id
tenant_id
```

Indexes

```
idx_users_email

idx_meetings_status

idx_clients_created_at
```

Unique Constraints

```
uq_users_email

uq_lawyers_license_number
```

---

# Standard Columns

Every business table must include:

```sql
id UUID PRIMARY KEY

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

created_by UUID

updated_by UUID
```

Soft-deletable entities additionally include:

```sql
deleted_at TIMESTAMPTZ

deleted_by UUID
```

---

# Global Enums

The following enums are shared across domains.

## UserRole

- client
- lawyer
- mediator
- admin
- super_admin

---

## UserStatus

- pending
- active
- suspended
- blocked
- deleted

---

## PaymentStatus

- pending
- processing
- completed
- failed
- refunded
- cancelled

---

## MeetingStatus

- scheduled
- waiting
- active
- completed
- cancelled
- no_show

---

## SubscriptionStatus

- trial
- active
- paused
- cancelled
- expired

---

# Shared Tables

Some tables are referenced across multiple domains.

Core shared entities include:

- users
- roles
- permissions
- countries
- currencies
- languages
- files
- audit_logs

Ownership of these tables is defined in their respective domain documents.

---

# Cross-Domain Relationships

The following relationships are considered foundational:

```
users
│
├── clients
├── lawyers
├── mediators
└── admins

lawyers
│
├── subscriptions
├── meetings
├── crm_contacts
├── invoices
└── payouts

clients
│
├── meetings
├── ai_conversations
├── documents
└── payments

meetings
│
├── recordings
├── transcripts
├── notes
└── invoices
```

Cross-domain relationships should always use foreign keys and maintain referential integrity.

---

# Shared Constraints

All domains must enforce:

- UUID primary keys
- Foreign key constraints
- NOT NULL where appropriate
- CHECK constraints for bounded values
- UNIQUE constraints for business identifiers

---

# Index Standards

Minimum indexes:

- Primary key
- Foreign keys
- Email
- Status
- Tenant identifier
- Created date

Additional indexes must be justified by query patterns.

---

# Security Standards

Every user-facing table must:

- Enable Row-Level Security (RLS)
- Define explicit policies
- Prevent cross-tenant access
- Support audit logging

---

# Audit Standards

Business-critical changes must generate audit events.

Examples:

- Login
- Registration
- Payments
- Subscription changes
- Profile updates
- Lawyer verification
- AI recommendations
- Permission changes

---

# Migration Strategy

Every domain owns its own migrations.

Migration naming convention:

```
YYYYMMDDHHMM_description.sql
```

Examples:

```
202607200900_create_users.sql

202607201030_add_subscription_status.sql
```

---

# Schema Evolution

Schema changes must:

1. Update the relevant domain schema document.
2. Include a migration.
3. Pass code review.
4. Be tested in staging.
5. Preserve backward compatibility where possible.

---

# Documentation Requirements

Each domain schema document must include:

- Purpose
- Tables
- Columns
- Data types
- Relationships
- Constraints
- Indexes
- RLS notes
- Triggers
- Views (if any)
- Business rules

---

# Implementation Order

The recommended implementation sequence is:

1. AUTH_SCHEMA.md
2. USER_SCHEMA.md
3. MARKETPLACE_SCHEMA.md
4. BOOKING_SCHEMA.md
5. MEETING_SCHEMA.md
6. PAYMENT_SCHEMA.md
7. SUBSCRIPTION_SCHEMA.md
8. CRM_SCHEMA.md
9. ACCOUNTING_SCHEMA.md
10. AI_SCHEMA.md
11. NOTIFICATION_SCHEMA.md
12. ANALYTICS_SCHEMA.md
13. SETTINGS_SCHEMA.md
14. STORAGE_SCHEMA.md
15. AUDIT_SCHEMA.md

Each completed domain becomes the source of truth for database migrations and application development.

---

# Success Criteria

The database schema documentation must:

- Be modular and maintainable.
- Clearly separate business domains.
- Support independent feature development.
- Align with the architecture and PRD.
- Provide sufficient detail for engineers and AI coding assistants to implement the database consistently.

This document serves as the master index for all Barristrly database schema documentation.