# ⚖️ Barristrly Event-Driven Architecture

> Version: 1.0
> Status: Approved
> Owner: Platform Architecture Team
> Depends On:
> - API_ARCHITECTURE.md
> - BACKGROUND_JOBS.md
> - REALTIME_EVENTS.md
> - AUDIT_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

This document defines how internal services communicate using events instead of direct dependencies.

It standardizes:

- Domain Events
- Integration Events
- Event Contracts
- Event Publishing
- Event Consumption
- Transactional Outbox Pattern
- Inbox Pattern
- Event Versioning
- Event Routing
- Sagas
- Process Orchestration
- Event Observability

The objective is to build loosely coupled, scalable, and resilient services.

---

# Architectural Goals

The event platform must provide:

✓ Loose coupling

✓ High scalability

✓ Reliable delivery

✓ Event traceability

✓ Horizontal service scaling

✓ Fault isolation

✓ Independent deployments

---

# High-Level Architecture

```
               Client Request
                     │
                     ▼
                 REST API
                     │
             Database Transaction
                     │
             Transactional Outbox
                     │
                     ▼
              Event Publisher
                     │
             Internal Event Bus
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 CRM Service   Booking Service   AI Service
      │              │              │
      └──────────────┼──────────────┘
                     ▼
           Background Workers
                     │
                     ▼
      Notifications / Audit / Analytics
```

---

# Event Categories

## Domain Events

Represent business facts.

Examples

```
booking.created

meeting.started

invoice.generated

payment.completed

subscription.renewed
```

---

## Integration Events

Published for other services.

Examples

```
crm.client.created

storage.file.uploaded

notification.sent

analytics.event.recorded
```

---

## System Events

Infrastructure-related.

Examples

```
worker.started

worker.failed

queue.overloaded

system.maintenance.enabled
```

---

# Event Naming Convention

Format

```
<domain>.<entity>.<action>
```

Examples

```
booking.created

booking.cancelled

meeting.summary.generated

payment.failed

storage.file.archived

ai.document.review.completed
```

Rules

- Lowercase
- Dot notation
- Past-tense business events where appropriate
- Stable names once released

---

# Event Envelope

Every event follows a standard schema.

```json
{
  "eventId": "uuid",
  "eventType": "booking.created",
  "eventVersion": "1.0",
  "occurredAt": "2026-07-18T10:30:00Z",
  "correlationId": "uuid",
  "causationId": "uuid",
  "organizationId": "uuid",
  "actorId": "uuid",
  "payload": {},
  "metadata": {}
}
```

---

# Event Flow

```
Business Action

↓

Database Commit

↓

Outbox Record

↓

Publisher

↓

Message Broker

↓

Consumers

↓

Audit + Analytics
```

Events are published **only after** the database transaction commits successfully.

---

# Transactional Outbox Pattern

Purpose

Guarantee consistency between database writes and event publication.

Workflow

```
Business Transaction

↓

Update Database

↓

Insert Outbox Event

↓

Commit

↓

Publisher Reads Outbox

↓

Publish Event

↓

Mark Published
```

Benefits

- Prevents lost events
- Eliminates dual-write problems
- Supports retries

---

# Inbox Pattern

Consumers maintain an inbox table.

Workflow

```
Receive Event

↓

Check Inbox

↓

Already Processed?

↓

Yes → Ignore

↓

No → Process

↓

Record Inbox Entry
```

Benefits

- Idempotent consumption
- Duplicate protection
- Reliable retries

---

# Event Broker

The broker is responsible for:

- Routing
- Delivery
- Retry
- Dead-letter queues
- Ordering (where required)
- Fan-out to multiple consumers

The broker should remain transport-agnostic to allow future technology changes.

---

# Delivery Semantics

Default

```
At Least Once
```

Consumers must be idempotent.

Exactly-once delivery is not assumed.

---

# Ordering

Ordering is required for:

- Payments
- Accounting
- Booking lifecycle
- Meeting lifecycle
- Subscription lifecycle

Ordering is not guaranteed across unrelated domains.

---

# Consumer Responsibilities

Every consumer must:

- Validate schema
- Verify version
- Check authorization context if applicable
- Apply idempotency
- Handle retries
- Emit audit events
- Publish follow-up events when necessary

---

# Saga Pattern

Long-running business processes are coordinated through sagas.

Example: Booking Workflow

```
Booking Created

↓

Reserve Slot

↓

Create Meeting

↓

Generate Invoice

↓

Send Notification

↓

Update Analytics
```

If a step fails:

```
Compensating Action

↓

Release Slot

↓

Cancel Meeting

↓

Refund Payment (if applicable)

↓

Notify Stakeholders
```

---

# Process Orchestration

Two approaches are supported:

### Choreography

Services react independently to events.

Suitable for:

- Notifications
- Analytics
- Audit
- AI enrichment

### Orchestration

A coordinator manages workflow.

Suitable for:

- Payments
- Subscription lifecycle
- Complex booking flows
- Multi-step onboarding

---

# Event Versioning

Every event includes:

```
eventVersion
```

Rules

- Additive changes are preferred.
- Breaking changes require a new major version.
- Consumers should support overlapping versions during migration.

---

# Dead Letter Queue

Messages enter the DLQ after exceeding retry limits.

Stored information

- Event ID
- Event Type
- Payload
- Consumer
- Failure Reason
- Retry Count
- Timestamp

DLQ events can be replayed after remediation.

---

# Event Replay

Replay is supported for:

- Analytics rebuilding
- Search reindexing
- AI embedding regeneration
- Disaster recovery
- New consumer onboarding

Replay must preserve original event ordering where required.

---

# Correlation & Tracing

Every event includes:

```
correlationId
```

and

```
causationId
```

Example

```
HTTP Request

↓

Booking Created

↓

Meeting Created

↓

Notification Sent

↓

Analytics Updated
```

All events share the same correlation ID for end-to-end tracing.

---

# Event Observability

Metrics

- Events published
- Events consumed
- Processing latency
- Consumer lag
- Retry rate
- DLQ size
- Publish failures
- Success rate

Tracing integrates with platform monitoring.

---

# Security

Events must:

- Exclude sensitive data unless required.
- Encrypt confidential payloads when necessary.
- Respect tenant isolation.
- Include organization context.
- Be validated against event schemas.

---

# Event Retention

Recommended retention:

| Event Type | Retention |
|------------|-----------|
| Business Events | 7 years |
| Audit Events | Per compliance policy |
| Analytics Events | 24 months |
| System Events | 90 days |
| Debug Events | 30 days |

Retention policies should align with legal and regulatory requirements.

---

# Event Catalog

## Identity

```
identity.profile.created

identity.profile.updated

identity.organization.created
```

---

## Marketplace

```
marketplace.listing.created

marketplace.review.created
```

---

## CRM

```
crm.lead.created

crm.matter.updated
```

---

## Booking

```
booking.created

booking.confirmed

booking.rescheduled

booking.cancelled
```

---

## Meeting

```
meeting.started

meeting.ended

meeting.summary.generated
```

---

## Payment

```
payment.intent.created

payment.completed

payment.failed

payment.refunded
```

---

## Subscription

```
subscription.created

subscription.renewed

subscription.cancelled
```

---

## Storage

```
storage.file.uploaded

storage.ocr.completed

storage.embedding.generated
```

---

## AI

```
ai.chat.completed

ai.document.review.completed

ai.prompt.executed
```

---

## Notification

```
notification.created

notification.delivered

notification.failed
```

---

## Analytics

```
analytics.event.recorded

analytics.dashboard.updated
```

---

# Integration with Other Components

The event platform integrates with:

- REST APIs
- Background Jobs
- Realtime Gateway
- Webhooks
- Audit
- Analytics
- AI Services
- Storage
- Notifications

---

# Disaster Recovery

The event system should support:

- Durable event storage
- Replay after outages
- Broker failover
- Consumer recovery
- Multi-region replication (future)

---

# Future Enhancements

- Event sourcing for selected domains
- CloudEvents compatibility
- Schema registry
- Cross-region event mesh
- Event compression
- Event prioritization
- AI-driven anomaly detection
- Workflow visualization

---

# Success Criteria

The Event-Driven Architecture must:

✓ Enable reliable communication between independent services.

✓ Eliminate tight coupling through asynchronous messaging.

✓ Support transactional consistency using the Outbox pattern.

✓ Ensure idempotent processing with Inbox tracking.

✓ Provide complete observability and replay capabilities.

✓ Scale to millions of events per day while maintaining reliability and traceability.

This document is the authoritative specification for internal event-driven communication within the Barristrly platform.