# ⚖️ Barristrly Entity Relationship Diagram (ERD)

> Version: 1.0
> Status: Approved
> Owner: Platform Architecture Team
> Depends On:
> - DATABASE_ARCHITECTURE.md
> - AUTH_SCHEMA.md
> - USER_SCHEMA.md
> - MARKETPLACE_SCHEMA.md
> - BOOKING_SCHEMA.md
> - MEETING_SCHEMA.md
> - CRM_SCHEMA.md
> - PAYMENT_SCHEMA.md
> - ACCOUNTING_SCHEMA.md
> - SUBSCRIPTION_SCHEMA.md
> - AI_SCHEMA.md
> - STORAGE_SCHEMA.md
> - AUDIT_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

This document defines the logical relationships between every major domain within Barristrly.

It serves as the master blueprint for:

- Database architects
- Backend engineers
- Frontend developers
- AI coding agents
- QA engineers
- DevOps teams

The ERD explains how data flows through the platform from authentication to legal consultations, payments, AI workflows, and auditing.

---

# High-Level Domain Relationships

```
                    AUTH
                     │
                     ▼
                IDENTITY
          ┌──────────┼───────────┐
          ▼          ▼           ▼
 Marketplace      CRM      Subscription
          │          │           │
          ▼          ▼           ▼
      Bookings ──────┼────── Payments
          │          │           │
          ▼          ▼           ▼
      Meetings    Notifications Accounting
          │          │
          ▼          ▼
      Storage ───── AI
          │          │
          └──────┬───┘
                 ▼
            Analytics
                 │
                 ▼
               Audit
```

---

# Domain Dependencies

| Domain | Depends On |
|---------|------------|
| Authentication | None |
| Identity | Authentication |
| Marketplace | Identity |
| CRM | Identity |
| Booking | Marketplace, CRM |
| Meeting | Booking |
| Payment | Booking, CRM |
| Accounting | Payment |
| Subscription | Identity, Payment |
| Notification | All Business Domains |
| AI | CRM, Meetings, Storage |
| Storage | Identity |
| Analytics | All Domains |
| Audit | All Domains |

---

# Core Entity Relationships

## Authentication

```
auth.users
      │
      │ 1:1
      ▼
profiles
```

One authenticated account owns exactly one profile.

---

## Identity

```
profiles
     │
     ├──────────────┐
     ▼              ▼
clients         lawyers
     │              │
     ▼              ▼
addresses     licenses
```

A profile may represent:

- Client
- Lawyer
- Administrator
- Organization Member

---

## Organizations

```
organizations
      │
      ├──────────────┐
      ▼              ▼
profiles       subscriptions
```

One organization owns:

- Members
- Subscription
- Settings
- Branding
- Analytics

---

# Marketplace Relationships

```
Lawyer
   │
   ▼
Listings
   │
   ├─────────────┐
   ▼             ▼
Services      Reviews
```

Lawyers publish listings.

Listings expose services.

Clients leave reviews.

---

# CRM Relationships

```
Lead
 │
 ▼
Contact
 │
 ▼
Matter
 │
 ├────────────┬─────────────┐
 ▼            ▼             ▼
Tasks      Notes      Timeline
```

A matter is the operational center of legal work.

---

# Booking Relationships

```
Lawyer
   │
Availability
   │
Booking
   │
Participants
```

Bookings represent scheduled consultations.

---

# Meeting Relationships

```
Booking
   │
Meeting
   │
 ├──────────────┬─────────────┐
 ▼              ▼             ▼
Recording   Transcript   Summary
```

Every meeting originates from one booking.

---

# Storage Relationships

```
Bucket
 │
Folder
 │
File
 │
 ├────────────┬─────────────┐
 ▼            ▼             ▼
Versions   Metadata     Permissions
```

All files belong to one bucket.

---

# Payment Relationships

```
Booking
   │
Invoice
   │
Payment Intent
   │
Transaction
   │
 ├─────────────┬─────────────┐
 ▼             ▼             ▼
Refund      Receipt      Payout
```

Payments are independent of accounting.

---

# Accounting Relationships

```
Transaction
      │
Journal Entry
      │
Journal Lines
      │
General Ledger
```

Every financial transaction produces accounting entries.

---

# Subscription Relationships

```
Plan
 │
Subscription
 │
 ├──────────────┬─────────────┐
 ▼              ▼             ▼
Features     Usage      AI Quotas
```

Subscriptions determine access.

---

# Notification Relationships

```
Event
 │
Notification
 │
 ├──────────────┬────────────┐
 ▼              ▼            ▼
Email      WhatsApp      Push
```

Notifications are event-driven.

---

# AI Relationships

```
Conversation
      │
Message
      │
 ├──────────────┬──────────────┐
 ▼              ▼              ▼
Prompt      Tool Call     Evaluation
```

Documents connect through embeddings.

```
Documents
      │
Embedding
      │
Vector Search
```

---

# Analytics Relationships

```
Events
 │
Aggregation
 │
Dashboards
 │
Reports
```

Analytics consumes events from every domain.

---

# Audit Relationships

```
Every Domain
      │
      ▼
Audit Event
      │
 ├──────────────┬───────────────┐
 ▼              ▼               ▼
Changes      Security      Compliance
```

Audit is platform-wide.

---

# Cross-Domain Reference Matrix

| Source Domain | References |
|---------------|------------|
| Identity | Auth |
| Marketplace | Identity |
| CRM | Identity |
| Booking | Marketplace, CRM |
| Meeting | Booking |
| Payment | Booking, CRM |
| Accounting | Payment |
| Subscription | Identity, Payment |
| Notification | All Domains |
| AI | CRM, Meetings, Storage |
| Analytics | All Domains |
| Audit | All Domains |

---

# Cardinality Overview

## User

```
User

1 → 1 Profile

1 → Many Devices

1 → Many Login History

1 → Many AI Conversations

1 → Many Notifications
```

---

## Organization

```
Organization

1 → Many Members

1 → One Subscription

1 → Many Settings

1 → Many Meetings

1 → Many Reports
```

---

## Lawyer

```
Lawyer

1 → Many Listings

1 → Many Services

1 → Many Bookings

1 → Many Meetings

1 → Many Reviews
```

---

## Client

```
Client

1 → Many Matters

1 → Many Bookings

1 → Many Payments

1 → Many Documents
```

---

## Booking

```
Booking

1 → One Meeting

1 → Many Participants

1 → One Invoice

1 → Many Notifications
```

---

## Meeting

```
Meeting

1 → One Transcript

1 → One Summary

1 → Many Files

1 → Many AI Actions
```

---

## File

```
File

1 → Many Versions

1 → Many Permissions

1 → Many Audit Events

1 → One AI Index
```

---

## Payment

```
Invoice

1 → Many Payment Attempts

1 → Many Transactions

1 → Many Refunds
```

---

## AI

```
Conversation

1 → Many Messages

Message

1 → Many Tool Calls

1 → Many Evaluations
```

---

# Global Architectural Rules

## UUID Primary Keys

Every entity uses UUID.

No integer IDs.

---

## Soft Deletes

Only business entities support soft deletion.

Audit records never support deletion.

---

## Append-Only Domains

Append-only:

- Audit
- Analytics Events
- AI Usage Logs
- Ledger
- Wallet Transactions
- Meeting Events

---

## Immutable Domains

Never modify:

- Audit Events
- Journal Entries
- Payment Transactions
- File Versions
- AI Prompt Versions

---

## Cross-Domain Communication

Domains communicate through:

- Events
- APIs
- Background Jobs

Never through direct database writes between bounded contexts.

---

# Performance Strategy

Large tables should support:

- Monthly partitioning (audit, analytics, AI usage)
- Composite indexes
- Partial indexes
- Full-text indexes where applicable
- Vector indexes for embeddings
- Read replicas for reporting workloads

---

# Naming Standards

- Singular table names are avoided.
- Snake_case naming convention.
- Foreign keys follow `<entity>_id`.
- Junction tables use `<entity_a>_<entity_b>` naming.

---

# Success Criteria

The ERD must:

✓ Clearly describe relationships between every Barristrly domain.

✓ Provide a shared architectural reference for engineering teams.

✓ Minimize coupling between bounded contexts.

✓ Support horizontal scalability and future service decomposition.

✓ Serve as the canonical relationship model for database implementation.

This document is the authoritative Entity Relationship Diagram specification for the Barristrly platform.