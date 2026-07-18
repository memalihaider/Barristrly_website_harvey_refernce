# ⚖️ Barristrly Booking Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - USER_SCHEMA.md
> - MARKETPLACE_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Booking domain manages the complete appointment lifecycle between clients and legal professionals.

It provides:

- Online booking
- Lawyer availability
- Calendar management
- Time slot generation
- Booking validation
- Rescheduling
- Cancellation
- Waitlists
- Reminder scheduling
- AI scheduling optimization

The Booking domain ends when a booking transitions into an active meeting.

---

# Domain Overview

```
Lawyer Availability
        │
        ▼
Available Time Slots
        │
        ▼
Booking Request
        │
        ▼
Booking Validation
        │
        ▼
Confirmed Booking
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Reminder Waitlist Reschedule
        │
        ▼
Meeting
```

---

# Core Tables

1. calendars
2. availability_rules
3. blocked_times
4. booking_slots
5. bookings
6. booking_participants
7. booking_history
8. booking_waitlist
9. booking_reminders
10. booking_notes

---

# Table: calendars

Purpose

Primary calendar assigned to each lawyer.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| name | TEXT |
| timezone | TEXT |
| default_duration | INTEGER |
| buffer_before | INTEGER |
| buffer_after | INTEGER |
| booking_window_days | INTEGER |
| active | BOOLEAN |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: availability_rules

Purpose

Recurring weekly availability.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| calendar_id | UUID |
| weekday | SMALLINT |
| start_time | TIME |
| end_time | TIME |
| slot_duration | INTEGER |
| effective_from | DATE |
| effective_to | DATE NULL |

---

# Table: blocked_times

Purpose

Unavailable periods.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| calendar_id | UUID |
| start_datetime | TIMESTAMPTZ |
| end_datetime | TIMESTAMPTZ |
| reason | TEXT |
| block_type | TEXT |
| created_at | TIMESTAMPTZ |

Examples

- Vacation
- Public Holiday
- Court Appearance
- Personal Leave
- Maintenance

---

# Table: booking_slots

Purpose

Generated appointment slots.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| calendar_id | UUID |
| start_datetime | TIMESTAMPTZ |
| end_datetime | TIMESTAMPTZ |
| available | BOOLEAN |
| booking_id | UUID NULL |
| generated_at | TIMESTAMPTZ |

Slots may be generated in advance or on demand.

---

# Table: bookings

Purpose

Central booking record.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| client_id | UUID |
| lawyer_id | UUID |
| service_id | UUID |
| calendar_id | UUID |
| slot_id | UUID |
| booking_status | booking_status |
| consultation_type | consultation_type |
| scheduled_start | TIMESTAMPTZ |
| scheduled_end | TIMESTAMPTZ |
| notes | TEXT |
| cancellation_reason | TEXT NULL |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: booking_participants

Purpose

Supports multi-party consultations.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| booking_id | UUID |
| profile_id | UUID |
| participant_role | TEXT |
| invited_at | TIMESTAMPTZ |
| accepted_at | TIMESTAMPTZ NULL |

Examples

- Client
- Lawyer
- Mediator
- Interpreter
- Observer

---

# Table: booking_history

Purpose

Immutable audit trail.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| booking_id | UUID |
| event_type | TEXT |
| previous_value | JSONB |
| new_value | JSONB |
| changed_by | UUID |
| changed_at | TIMESTAMPTZ |

Examples

- Created
- Confirmed
- Rescheduled
- Cancelled
- Completed

---

# Table: booking_waitlist

Purpose

Automatically fill cancelled appointments.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| client_id | UUID |
| preferred_date | DATE |
| preferred_time | TEXT |
| service_id | UUID |
| priority | INTEGER |
| created_at | TIMESTAMPTZ |

---

# Table: booking_reminders

Purpose

Tracks scheduled reminders.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| booking_id | UUID |
| reminder_type | TEXT |
| scheduled_at | TIMESTAMPTZ |
| sent_at | TIMESTAMPTZ NULL |
| delivery_status | reminder_status |

Reminder channels

- Email
- SMS
- WhatsApp
- Push Notification

---

# Table: booking_notes

Purpose

Internal notes before the consultation.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| booking_id | UUID |
| author_id | UUID |
| note | TEXT |
| visibility | TEXT |
| created_at | TIMESTAMPTZ |

Visibility

- Private
- Shared with Team
- Shared with Client

---

# Relationships

```
Calendars
      │
      ▼
Availability Rules
      │
      ▼
Booking Slots
      │
      ▼
Bookings
 ┌────┼───────────────┐
 ▼    ▼               ▼
Notes History Participants
 │
 ▼
Reminders

Bookings
      │
      ▼
Meetings
```

---

# Enumerations

## booking_status

- pending
- awaiting_confirmation
- confirmed
- checked_in
- completed
- cancelled
- no_show

---

## consultation_type

- video
- voice
- in_person
- chat

---

## reminder_status

- pending
- sent
- delivered
- failed

---

# Booking Rules

- Only verified lawyers may receive bookings.
- Double-booking is prohibited.
- Bookings must fall within available calendar rules.
- Blocked periods override availability.
- Buffer times must be respected.
- Bookings outside the configured booking window are rejected.
- Only active legal services can be booked.

---

# Rescheduling

Rescheduling creates:

- Booking history event
- Updated slot allocation
- New reminders
- Availability recalculation

Previous schedule information remains preserved in the audit trail.

---

# Cancellation Policy

Cancellation records:

- Reason
- Initiator
- Timestamp
- Refund eligibility
- Waitlist notification status

Cancelled slots immediately become eligible for waitlist fulfillment.

---

# Waitlist Processing

When a slot becomes available:

1. Identify matching waitlist entries.
2. Rank by priority and request time.
3. Notify the highest-ranked client.
4. Reserve the slot for a configurable period.
5. Release the slot if not accepted.

---

# AI Scheduling

The AI engine may recommend:

- Optimal meeting times.
- Reduced scheduling conflicts.
- Timezone-aware appointments.
- Lawyer workload balancing.
- Faster appointment availability.
- Intelligent waitlist matching.
- Predicted no-show risk.

AI recommendations should be advisory and explainable.

---

# Row-Level Security

## Bookings

Clients

- View and manage their own bookings.

Lawyers

- View and manage bookings assigned to them.

Administrators

- Full access.

---

## Notes

Private notes are visible only to authorized participants.

Shared notes follow the configured visibility level.

---

## History

Append-only.

No updates or deletions permitted.

---

# Background Jobs

Scheduled jobs include:

- Slot generation
- Reminder dispatch
- Waitlist processing
- Availability recalculation
- Booking expiration
- Calendar synchronization

---

# Future Enhancements

- Google Calendar sync
- Microsoft Outlook sync
- Apple Calendar sync
- Recurring consultations
- Team calendars
- Resource booking (rooms/equipment)
- AI conflict resolution
- Group legal consultations
- Court hearing integration
- Automated travel-time estimation for in-person meetings

---

# Success Criteria

The Booking domain must:

✓ Prevent scheduling conflicts.

✓ Support multiple consultation types.

✓ Respect lawyer availability.

✓ Maintain a complete audit trail.

✓ Scale to enterprise law firms.

✓ Integrate seamlessly with meetings, payments, notifications, CRM, and AI scheduling.

This schema is the authoritative reference for all appointment scheduling and booking workflows in Barristrly.