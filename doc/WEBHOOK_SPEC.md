# ⚖️ Barristrly Webhook Specification

> Version: 1.0
> Status: Approved
> Owner: Platform Integration Team
> Depends On:
> - API_ARCHITECTURE.md
> - REST_API_SPEC.md
> - REALTIME_EVENTS.md
> - AUDIT_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

The Webhook system allows Barristrly to notify external systems whenever important events occur.

Supported capabilities:

- Event subscriptions
- Secure webhook delivery
- HMAC signature verification
- Retry management
- Dead-letter queues
- Idempotency
- Event replay
- Delivery monitoring
- Secret rotation
- Versioned payloads

The webhook platform enables reliable integrations without requiring external polling.

---

# High-Level Architecture

```
Application Event
        │
        ▼
 Event Bus
        │
        ▼
Webhook Dispatcher
        │
 ┌──────┼──────────────┐
 ▼      ▼              ▼
Retry Queue      Dead Letter Queue
        │
        ▼
External Endpoint
        │
        ▼
200 OK
```

---

# Supported Events

Events follow the same naming convention as realtime events.

Examples:

```
booking.created

booking.updated

booking.cancelled

meeting.started

meeting.ended

meeting.summary.ready

payment.completed

payment.failed

invoice.created

subscription.created

subscription.cancelled

storage.file.uploaded

storage.file.deleted

notification.created

ai.document.completed

organization.member.created

lawyer.review.created
```

---

# Endpoint Registration

Base Endpoint

```
POST /api/v1/webhooks
```

Example Request

```json
{
  "url": "https://example.com/webhooks",
  "events": [
    "booking.created",
    "payment.completed"
  ],
  "secret": "generated-secret"
}
```

---

# Webhook Resource

Fields

| Field | Type |
|--------|------|
| id | UUID |
| organizationId | UUID |
| url | String |
| status | active/inactive |
| events | Array |
| signingAlgorithm | HMAC-SHA256 |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

# Event Payload Format

Every webhook payload follows a standard envelope.

```json
{
  "id": "evt_123456",
  "type": "booking.created",
  "version": "1.0",
  "timestamp": "2026-07-18T10:30:00Z",
  "organizationId": "uuid",
  "correlationId": "uuid",
  "data": {}
}
```

---

# Example Payload

```json
{
  "id": "evt_123456",
  "type": "payment.completed",
  "version": "1.0",
  "timestamp": "2026-07-18T10:30:00Z",
  "organizationId": "uuid",
  "data": {
    "paymentId": "uuid",
    "invoiceId": "uuid",
    "amount": 250.00,
    "currency": "AED",
    "status": "completed"
  }
}
```

---

# HTTP Method

All webhook deliveries use:

```
POST
```

Content Type

```
application/json
```

---

# Headers

Each request includes:

```
Content-Type: application/json

User-Agent: Barristrly-Webhooks/1.0

X-Webhook-ID

X-Event-ID

X-Event-Type

X-Timestamp

X-Correlation-ID

X-Signature

X-Retry-Count
```

---

# Signature Verification

All payloads are signed.

Algorithm

```
HMAC-SHA256
```

Example

```
signature = HMAC(secret, rawBody)
```

External systems must validate:

- Timestamp
- Signature
- Replay window

before processing the event.

---

# Replay Protection

Each event includes:

```
X-Event-ID
```

Consumers should store processed event IDs and ignore duplicates.

---

# Idempotency

Webhook deliveries are **at-least-once**.

Consumers **must** implement idempotent processing.

Never assume only one delivery.

---

# Delivery Expectations

A successful endpoint returns:

```
HTTP 200

or

HTTP 202
```

Timeout:

```
10 seconds
```

Long-running processing should be handled asynchronously by the receiving system.

---

# Retry Policy

Retries occur on:

- Timeout
- HTTP 5xx
- Network failure

No retries on:

- HTTP 2xx
- HTTP 4xx (except configurable cases)

Default backoff:

```
1 minute

5 minutes

15 minutes

30 minutes

1 hour

6 hours

24 hours
```

Maximum attempts:

```
10
```

---

# Dead Letter Queue

Failed deliveries exceeding retry limits are moved to the Dead Letter Queue (DLQ).

Each DLQ entry records:

- Event ID
- Webhook ID
- Last response
- Failure reason
- Retry history
- Timestamp

Administrators can inspect and replay DLQ events.

---

# Event Replay

Replay Endpoint

```
POST /api/v1/webhooks/{id}/replay
```

Replay uses the original payload with a new delivery timestamp.

---

# Secret Rotation

Secrets may be rotated without downtime.

Recommended flow:

```
Current Secret

↓

Generate New Secret

↓

Both Secrets Accepted

↓

External System Updated

↓

Old Secret Removed
```

---

# Webhook Lifecycle

```
Create

↓

Verify

↓

Activate

↓

Deliver Events

↓

Retry (if needed)

↓

Archive or Delete
```

---

# Endpoint Verification

Optional verification challenge:

```
POST

↓

Verification Token

↓

External Endpoint Responds

↓

Webhook Activated
```

---

# Event Versioning

Every payload includes:

```
version
```

Breaking payload changes require a new version.

Example:

```
1.0

2.0
```

---

# Event Ordering

Ordering is guaranteed only within a single webhook subscription where supported.

Consumers must not assume global ordering across unrelated event types.

---

# Filtering

Subscriptions may filter by:

- Organization
- Event type
- Resource
- Priority

Example

```json
{
  "events": [
    "booking.*",
    "payment.completed"
  ]
}
```

---

# Rate Limiting

Maximum delivery throughput is configurable per organization.

Burst protection prevents endpoint overload.

---

# Monitoring

Metrics collected:

- Delivery latency
- Success rate
- Failure rate
- Retry count
- DLQ count
- Average response time
- Endpoint availability

---

# Webhook Logs

Every delivery records:

- Event ID
- Webhook ID
- Request body hash
- HTTP status
- Response time
- Retry count
- Signature
- Timestamp

Logs integrate with the Audit domain.

---

# Security Requirements

- HTTPS only
- TLS 1.2+
- HMAC signatures
- Timestamp validation
- Replay protection
- Secret rotation
- Request size limits
- IP allowlisting (optional)
- Rate limiting

---

# Failure Handling

If delivery fails:

1. Log the failure.
2. Schedule retry.
3. Update webhook metrics.
4. Notify administrators if thresholds are exceeded.
5. Move to DLQ after maximum retries.

---

# Administrative APIs

```
GET /api/v1/webhooks

POST /api/v1/webhooks

PATCH /api/v1/webhooks/{id}

DELETE /api/v1/webhooks/{id}

GET /api/v1/webhooks/{id}/deliveries

POST /api/v1/webhooks/{id}/replay

POST /api/v1/webhooks/{id}/rotate-secret
```

---

# Future Enhancements

- Mutual TLS (mTLS)
- Event batching
- Event compression
- Webhook templates
- Regional delivery endpoints
- Custom transformation pipelines
- GraphQL subscriptions
- CloudEvents compatibility

---

# Success Criteria

The webhook platform must:

✓ Deliver events reliably with at-least-once guarantees.

✓ Protect payload integrity through cryptographic signatures.

✓ Support retries, replay, and dead-letter handling.

✓ Scale to millions of webhook deliveries per day.

✓ Provide complete observability and auditability for every delivery.

✓ Enable secure integrations with enterprise and third-party systems.

This document is the authoritative specification for outbound webhook delivery within the Barristrly platform.