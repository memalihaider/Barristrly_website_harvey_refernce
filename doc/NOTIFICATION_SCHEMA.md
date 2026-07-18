# ⚖️ Barristrly Notification Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - AUTH_SCHEMA.md
> - BOOKING_SCHEMA.md
> - MEETING_SCHEMA.md
> - PAYMENT_SCHEMA.md
> - SUBSCRIPTION_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Notification domain manages all user communications across Barristrly.

It supports:

- Email
- SMS
- WhatsApp
- Push Notifications
- In-App Notifications
- Webhooks
- Scheduled Notifications
- Notification Templates
- User Preferences
- Delivery Tracking
- Retry Management
- AI-generated content

This domain is event-driven and decoupled from business modules.

---

# Domain Overview

```
Application Event
       │
       ▼
Notification Queue
       │
       ▼
Notification
       │
 ┌─────┼────────────┬────────────┬─────────────┐
 ▼     ▼            ▼            ▼             ▼
Email WhatsApp    SMS         Push       In-App
       │
       ▼
Delivery Tracking
       │
       ▼
Analytics
```

---

# Core Tables

1. notification_events
2. notification_templates
3. notifications
4. notification_channels
5. notification_preferences
6. notification_deliveries
7. notification_queue
8. notification_retry_queue
9. notification_webhooks
10. notification_logs
11. notification_ai_content

---

# Table: notification_events

Purpose

Represents system events that trigger notifications.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| event_name | TEXT UNIQUE |
| description | TEXT |
| enabled | BOOLEAN |
| created_at | TIMESTAMPTZ |

Examples

- booking.confirmed
- booking.cancelled
- meeting.started
- payment.received
- invoice.overdue
- subscription.expiring
- lawyer.verified
- ai.summary.ready

---

# Table: notification_templates

Purpose

Reusable notification templates.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| event_id | UUID |
| channel | notification_channel |
| language | TEXT |
| subject | TEXT |
| body | TEXT |
| variables | JSONB |
| active | BOOLEAN |
| version | INTEGER |
| created_at | TIMESTAMPTZ |

Templates support variable placeholders.

Example

```
{{client_name}}

{{lawyer_name}}

{{meeting_time}}
```

---

# Table: notifications

Purpose

Represents a notification instance.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| recipient_id | UUID |
| event_id | UUID |
| template_id | UUID |
| priority | notification_priority |
| status | notification_status |
| scheduled_for | TIMESTAMPTZ NULL |
| created_at | TIMESTAMPTZ |

---

# Table: notification_channels

Purpose

Delivery channels.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| notification_id | UUID |
| channel | notification_channel |
| provider | TEXT |
| provider_reference | TEXT |
| status | delivery_status |

Providers

Email

- Resend
- SMTP

SMS

- Twilio

WhatsApp

- Meta WhatsApp Cloud API

Push

- Firebase Cloud Messaging

---

# Table: notification_preferences

Purpose

User communication preferences.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| event_name | TEXT |
| email_enabled | BOOLEAN |
| sms_enabled | BOOLEAN |
| whatsapp_enabled | BOOLEAN |
| push_enabled | BOOLEAN |
| in_app_enabled | BOOLEAN |
| quiet_hours_start | TIME NULL |
| quiet_hours_end | TIME NULL |

---

# Table: notification_deliveries

Purpose

Tracks actual deliveries.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| channel_id | UUID |
| delivered_at | TIMESTAMPTZ |
| opened_at | TIMESTAMPTZ NULL |
| clicked_at | TIMESTAMPTZ NULL |
| failed_at | TIMESTAMPTZ NULL |
| failure_reason | TEXT NULL |

---

# Table: notification_queue

Purpose

Pending notifications.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| notification_id | UUID |
| scheduled_time | TIMESTAMPTZ |
| priority | INTEGER |
| attempts | INTEGER |
| worker | TEXT NULL |

---

# Table: notification_retry_queue

Purpose

Failed delivery retries.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| notification_id | UUID |
| retry_number | INTEGER |
| next_retry_at | TIMESTAMPTZ |
| last_error | TEXT |

Retry policy should use exponential backoff.

---

# Table: notification_webhooks

Purpose

Outgoing webhook deliveries.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| event_name | TEXT |
| endpoint | TEXT |
| payload | JSONB |
| response_code | INTEGER |
| status | webhook_status |
| delivered_at | TIMESTAMPTZ |

---

# Table: notification_logs

Purpose

Immutable notification audit log.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| notification_id | UUID |
| action | TEXT |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Examples

- Queued
- Sent
- Delivered
- Opened
- Clicked
- Failed
- Retried

---

# Table: notification_ai_content

Purpose

Stores AI-generated notification content.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| notification_id | UUID |
| generated_subject | TEXT |
| generated_body | TEXT |
| model_name | TEXT |
| prompt_version | TEXT |
| generated_at | TIMESTAMPTZ |

---

# Relationships

```
Events
   │
   ▼
Templates
   │
   ▼
Notifications
 ┌────┼──────────────┬─────────────┐
 ▼    ▼              ▼             ▼
Queue Channels     AI Content   Preferences
 │      │
 ▼      ▼
Retry Deliveries
 │
 ▼
Logs
```

---

# Enumerations

## notification_channel

- email
- sms
- whatsapp
- push
- in_app
- webhook

---

## notification_priority

- low
- normal
- high
- urgent

---

## notification_status

- pending
- queued
- processing
- sent
- delivered
- failed
- cancelled

---

## delivery_status

- pending
- sent
- delivered
- opened
- clicked
- failed

---

## webhook_status

- pending
- delivered
- failed

---

# Event Sources

Notifications may originate from:

- Authentication
- Marketplace
- Booking
- Meeting
- CRM
- Payment
- Subscription
- AI
- Administration

All modules publish events instead of sending notifications directly.

---

# Business Rules

- Every notification originates from an event.
- User preferences determine allowed channels.
- High-priority notifications may override quiet hours when configured.
- Failed deliveries are retried automatically.
- Delivery logs are immutable.
- Templates are versioned to preserve historical accuracy.

---

# AI Features

AI may:

- Personalize notification text.
- Translate messages.
- Generate concise summaries.
- Optimize send times.
- Recommend communication channels.
- Predict engagement likelihood.

Generated content must remain editable before delivery where required.

---

# Row-Level Security

Users

- View only their own notifications and preferences.

Administrators

- Manage templates, events, and delivery monitoring.

Support Staff

- Read delivery status without viewing sensitive message content unless explicitly authorized.

---

# Background Jobs

- Queue processing
- Template rendering
- Provider dispatch
- Retry scheduling
- Delivery status synchronization
- Webhook delivery
- Notification cleanup
- Analytics aggregation

---

# Integrations

Email

- Resend

SMS

- Twilio

WhatsApp

- Meta WhatsApp Cloud API

Push

- Firebase Cloud Messaging

Webhooks

- Customer-defined endpoints

Analytics

- Event tracking
- Delivery metrics
- Open rates
- Click-through rates

---

# Future Enhancements

- Multi-language template management
- A/B testing
- Smart send-time optimization
- Campaign management
- Digest notifications
- Rich media messaging
- AI conversation follow-ups
- Notification fatigue detection

---

# Success Criteria

The Notification domain must:

✓ Deliver reliable cross-channel communication.

✓ Respect user notification preferences.

✓ Maintain complete delivery audit trails.

✓ Support high-volume asynchronous processing.

✓ Integrate seamlessly with every Barristrly domain.

✓ Enable future AI-driven communication optimization.

This document is the authoritative specification for notification and communication workflows within Barristrly.