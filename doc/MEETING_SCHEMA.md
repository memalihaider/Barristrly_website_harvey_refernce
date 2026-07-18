# ⚖️ Barristrly Meeting Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - BOOKING_SCHEMA.md
> - USER_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Meeting domain manages the complete lifecycle of legal consultations after a booking is confirmed.

It supports:

- Video meetings
- Voice meetings
- Chat consultations
- In-person consultations
- Meeting participants
- AI transcription
- AI summaries
- Recordings
- Notes
- Action items
- Follow-up tasks

The Meeting domain begins when a booking is confirmed and ends when all meeting artifacts have been processed.

---

# Domain Overview

```
Booking
   │
   ▼
Meeting
   │
   ├───────────────┐
   ▼               ▼
Participants     Recording
   │               │
   ▼               ▼
Transcript     AI Summary
   │               │
   └──────┬────────┘
          ▼
     Action Items
          │
          ▼
      CRM / Billing
```

---

# Core Tables

1. meetings
2. meeting_rooms
3. meeting_participants
4. meeting_attendance
5. meeting_recordings
6. meeting_transcripts
7. meeting_summaries
8. meeting_notes
9. meeting_files
10. meeting_action_items
11. meeting_events

---

# Table: meetings

Purpose

Represents a legal consultation session.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| booking_id | UUID |
| room_id | UUID |
| meeting_type | meeting_type |
| status | meeting_status |
| scheduled_start | TIMESTAMPTZ |
| scheduled_end | TIMESTAMPTZ |
| actual_start | TIMESTAMPTZ NULL |
| actual_end | TIMESTAMPTZ NULL |
| duration_minutes | INTEGER |
| recording_enabled | BOOLEAN |
| transcription_enabled | BOOLEAN |
| ai_summary_enabled | BOOLEAN |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: meeting_rooms

Purpose

Virtual or physical consultation rooms.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| room_identifier | TEXT UNIQUE |
| provider | TEXT |
| join_url | TEXT |
| host_url | TEXT |
| room_password | TEXT NULL |
| room_status | room_status |
| expires_at | TIMESTAMPTZ |

Providers

- Mediasoup
- Zoom
- Google Meet
- Microsoft Teams
- Physical Office

---

# Table: meeting_participants

Purpose

Participants assigned to a meeting.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| profile_id | UUID |
| participant_role | TEXT |
| invitation_status | invitation_status |
| joined_at | TIMESTAMPTZ NULL |
| left_at | TIMESTAMPTZ NULL |

---

# Table: meeting_attendance

Purpose

Attendance analytics.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| participant_id | UUID |
| total_minutes | INTEGER |
| late_by_minutes | INTEGER |
| left_early | BOOLEAN |
| attendance_status | attendance_status |

---

# Table: meeting_recordings

Purpose

Metadata for meeting recordings.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| storage_path | TEXT |
| duration_seconds | INTEGER |
| file_size | BIGINT |
| recording_format | TEXT |
| processing_status | processing_status |
| created_at | TIMESTAMPTZ |

---

# Table: meeting_transcripts

Purpose

Stores AI-generated transcripts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| transcript_text | TEXT |
| language | TEXT |
| confidence_score | NUMERIC(5,2) |
| generated_by | TEXT |
| created_at | TIMESTAMPTZ |

---

# Table: meeting_summaries

Purpose

AI-generated summaries.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| summary | TEXT |
| key_points | JSONB |
| legal_issues | JSONB |
| recommendations | JSONB |
| follow_up_required | BOOLEAN |
| generated_at | TIMESTAMPTZ |

---

# Table: meeting_notes

Purpose

Manual notes taken during the consultation.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| author_id | UUID |
| note | TEXT |
| visibility | note_visibility |
| created_at | TIMESTAMPTZ |

---

# Table: meeting_files

Purpose

Documents shared during the consultation.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| uploaded_by | UUID |
| file_name | TEXT |
| storage_path | TEXT |
| mime_type | TEXT |
| file_size | BIGINT |
| uploaded_at | TIMESTAMPTZ |

Examples

- Contracts
- Evidence
- Images
- PDFs
- Court Documents

---

# Table: meeting_action_items

Purpose

Tasks created from meeting outcomes.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| assigned_to | UUID |
| description | TEXT |
| due_date | DATE |
| priority | priority_level |
| status | action_status |
| completed_at | TIMESTAMPTZ NULL |

---

# Table: meeting_events

Purpose

Chronological event log.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| meeting_id | UUID |
| event_type | TEXT |
| actor_id | UUID |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Examples

- Joined
- Left
- Recording Started
- Screen Shared
- File Uploaded
- AI Summary Generated

---

# Relationships

```
Bookings
    │
    ▼
Meetings
    │
 ┌──┼─────────────┬─────────────┬─────────────┐
 ▼  ▼             ▼             ▼             ▼
Room Participants Recording Transcript Summary
 │   │             │             │             │
 ▼   ▼             ▼             ▼             ▼
Attendance      Files       Notes      Action Items
                 │
                 ▼
             Event Log
```

---

# Enumerations

## meeting_type

- video
- voice
- chat
- in_person

---

## meeting_status

- scheduled
- waiting
- live
- completed
- cancelled
- failed

---

## room_status

- available
- active
- expired
- archived

---

## invitation_status

- pending
- accepted
- declined
- joined

---

## attendance_status

- present
- absent
- late
- partial

---

## processing_status

- pending
- processing
- completed
- failed

---

## note_visibility

- private
- participants
- organization

---

## priority_level

- low
- medium
- high
- urgent

---

## action_status

- pending
- in_progress
- completed
- cancelled

---

# AI Features

Supported AI capabilities:

- Live speech-to-text transcription
- Speaker identification
- Automatic meeting summaries
- Legal issue extraction
- Key decision detection
- Action item generation
- Sentiment analysis
- Follow-up recommendation
- Translation (future)
- Compliance checks (future)

AI outputs should always reference the originating meeting.

---

# Business Rules

- Every meeting must originate from a confirmed booking.
- Meeting rooms are created automatically.
- Recordings require participant consent where applicable.
- AI summaries are generated only after meeting completion.
- Action items may be assigned only to meeting participants.
- Deleted meetings are soft-deleted for audit purposes.

---

# Row-Level Security

Meetings

- Clients and lawyers may access only meetings in which they participate.
- Administrators may access all meetings for operational purposes.

Recordings

- Accessible only to authorized participants and administrators.

Transcripts

- Restricted to participants unless explicitly shared.

Files

- Available only to meeting participants.

Events

- Read-only; append-only for system processes.

---

# Background Jobs

- Meeting room provisioning
- Recording processing
- Speech-to-text generation
- AI summary generation
- Action item extraction
- Meeting archival
- Storage cleanup
- Reminder completion

---

# Integrations

Meeting services:

- Mediasoup (primary)
- Zoom (optional)
- Google Meet (future)
- Microsoft Teams (future)

AI services:

- Whisper (speech-to-text)
- Gemini / OpenAI (summaries)
- Embedding service (semantic search)

Storage:

- Supabase Storage

Notifications:

- Email
- SMS
- WhatsApp
- Push

---

# Future Enhancements

- Live captions
- AI legal research during meetings
- Collaborative whiteboard
- Digital signatures
- Screen annotation
- Court evidence timeline
- Multi-language interpretation
- AI legal assistant copilot
- Real-time compliance monitoring

---

# Success Criteria

The Meeting domain must:

✓ Support secure legal consultations.

✓ Generate searchable AI meeting artifacts.

✓ Maintain complete auditability.

✓ Integrate seamlessly with bookings, CRM, billing, notifications, and AI services.

✓ Scale from one-on-one consultations to enterprise legal teams.

This document is the authoritative specification for all consultation and meeting workflows in Barristrly.