# ⚖️ Barristrly Realtime Events Specification

> Version: 1.0
> Status: Approved
> Owner: Platform Infrastructure Team
> Depends On:
> - API_ARCHITECTURE.md
> - REST_API_SPEC.md
> - SYSTEM_ARCHITECTURE.md
> - AI_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

This document defines the realtime communication architecture for Barristrly.

It standardizes:

- WebSocket communication
- Supabase Realtime integration
- Live event publishing
- Event subscriptions
- AI streaming
- Presence tracking
- Typing indicators
- Live booking updates
- Meeting synchronization
- Notification delivery
- Reconnection strategy

Every realtime feature must follow this specification.

---

# High-Level Architecture

```
                Browser / Mobile
                       │
            WebSocket / Realtime SDK
                       │
                       ▼
              Realtime Gateway
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Event Bus        Presence Engine   Stream Engine
      │                │                │
      └──────────┬─────┴────────────────┘
                 ▼
          Business Services
      ┌──────────┼───────────┐
      ▼          ▼           ▼
 Booking     Meeting      AI Service
```

---

# Transport

Primary transport:

```
WebSocket
```

Fallback:

- Server-Sent Events (SSE)
- Long Polling (legacy compatibility)

---

# Authentication

Realtime connections require a valid JWT.

Connection Flow

```
Client

↓

JWT Validation

↓

Organization Resolution

↓

Permission Check

↓

Realtime Connection Established
```

Connections without authentication are rejected unless explicitly configured for public channels.

---

# Channel Naming Convention

Format

```
<domain>:<resource>:<identifier>
```

Examples

```
booking:organization:{organizationId}

meeting:{meetingId}

chat:{conversationId}

notification:user:{userId}

presence:organization:{organizationId}

ai:conversation:{conversationId}
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

booking.updated

booking.cancelled

meeting.started

meeting.ended

meeting.recording.ready

payment.completed

notification.created

ai.response.chunk

ai.response.completed

storage.file.uploaded
```

All event names use lowercase and dot notation.

---

# Standard Event Envelope

Every realtime event follows the same structure.

```json
{
  "event": "booking.updated",
  "timestamp": "2026-07-18T10:30:00Z",
  "organizationId": "uuid",
  "correlationId": "uuid",
  "payload": {}
}
```

---

# Booking Events

Channel

```
booking:organization:{organizationId}
```

Events

```
booking.created

booking.updated

booking.confirmed

booking.cancelled

booking.rescheduled

booking.reminder.sent

booking.waitlist.promoted
```

Example Payload

```json
{
  "bookingId": "uuid",
  "status": "confirmed",
  "startTime": "2026-07-20T09:00:00Z"
}
```

---

# Meeting Events

Channel

```
meeting:{meetingId}
```

Events

```
meeting.started

meeting.ended

meeting.participant.joined

meeting.participant.left

meeting.recording.started

meeting.recording.completed

meeting.transcript.ready

meeting.summary.ready
```

---

# AI Streaming Events

Channel

```
ai:conversation:{conversationId}
```

Events

```
ai.response.started

ai.response.chunk

ai.response.completed

ai.tool.started

ai.tool.completed

ai.error
```

Streaming Payload

```json
{
  "chunk": "The generated response...",
  "sequence": 12,
  "isFinal": false
}
```

The final event sets:

```
"isFinal": true
```

---

# Notification Events

Channel

```
notification:user:{userId}
```

Events

```
notification.created

notification.updated

notification.deleted

notification.read
```

Payload

```json
{
  "notificationId": "uuid",
  "title": "Booking Confirmed",
  "priority": "high"
}
```

---

# Chat Events

Channel

```
chat:{conversationId}
```

Events

```
chat.message.created

chat.message.updated

chat.message.deleted

chat.typing.started

chat.typing.stopped

chat.read
```

---

# Presence

Presence channels

```
presence:organization:{organizationId}
```

Track

- Online
- Offline
- Idle
- Busy
- In Meeting

Presence Payload

```json
{
  "userId": "uuid",
  "status": "online",
  "lastSeen": "2026-07-18T10:30:00Z"
}
```

---

# Typing Indicators

Events

```
typing.started

typing.stopped
```

Payload

```json
{
  "userId": "uuid",
  "conversationId": "uuid"
}
```

Typing indicators should automatically expire after a short timeout unless refreshed.

---

# File Processing Events

Events

```
storage.upload.started

storage.upload.completed

storage.virus_scan.completed

storage.ocr.completed

storage.embedding.completed

storage.preview.ready
```

---

# Payment Events

Events

```
payment.created

payment.processing

payment.completed

payment.failed

payment.refunded
```

---

# Subscription Events

Events

```
subscription.created

subscription.updated

subscription.cancelled

subscription.renewed

subscription.usage.updated
```

---

# Analytics Events

Internal realtime events

```
analytics.event.created

analytics.dashboard.updated
```

Primarily consumed by internal services rather than client applications.

---

# Event Delivery

Delivery guarantees:

- At least once
- Ordered within a channel where supported
- Idempotent consumers required

Consumers must tolerate duplicate event delivery.

---

# Subscription Lifecycle

```
Connect

↓

Authenticate

↓

Subscribe

↓

Receive Events

↓

Heartbeat

↓

Reconnect (if needed)

↓

Unsubscribe

↓

Disconnect
```

---

# Heartbeats

Clients send periodic heartbeat messages to maintain connection health.

If multiple heartbeats are missed:

- Mark client disconnected
- Release presence state
- Trigger reconnect logic on the client

---

# Reconnection Strategy

Recommended backoff:

```
1 second

2 seconds

4 seconds

8 seconds

16 seconds

30 seconds (maximum)
```

Reconnect attempts should include the last acknowledged event identifier when supported.

---

# Event Ordering

Where ordering matters:

- Booking events
- Meeting events
- AI response chunks
- Payment events

Sequence numbers should be included in payloads for ordered streams.

---

# Event Filtering

Subscriptions may filter by:

- Organization
- User
- Meeting
- Booking
- Conversation
- Matter
- Priority

Example

```
booking:organization:{organizationId}?status=confirmed
```

---

# Security

Every event must enforce:

- JWT validation
- Organization isolation
- Permission verification
- Row-level authorization
- Event sanitization

Sensitive data must never be broadcast to unauthorized subscribers.

---

# Observability

Every connection records:

- Connection ID
- User ID
- Organization ID
- Connected At
- Disconnected At
- Events Sent
- Events Received
- Latency
- Reconnect Count

Metrics feed the Analytics and Audit domains.

---

# Failure Handling

On publish failure:

1. Retry according to policy.
2. Persist the event if required.
3. Record the failure in Audit.
4. Notify monitoring systems if thresholds are exceeded.

---

# Background Workers

Responsible for:

- Event publishing
- Presence cleanup
- Retry queues
- Dead-letter queue processing
- Stream completion
- Subscription cleanup

---

# Integration Points

Realtime integrates with:

- Authentication
- Bookings
- Meetings
- AI
- Notifications
- Storage
- Payments
- CRM
- Analytics
- Audit

---

# Future Enhancements

- Multi-region realtime clusters
- End-to-end encrypted channels
- Live collaborative document editing
- Voice activity detection
- Event replay
- Offline synchronization
- Cross-device state synchronization
- WebRTC data channels for peer collaboration

---

# Success Criteria

The realtime architecture must:

✓ Deliver low-latency updates across all clients.

✓ Support secure, authenticated event delivery.

✓ Enable AI streaming and collaborative workflows.

✓ Maintain reliable event delivery with resilient reconnection.

✓ Scale horizontally across thousands of concurrent organizations and millions of active connections.

This document is the authoritative specification for realtime communication within the Barristrly platform.