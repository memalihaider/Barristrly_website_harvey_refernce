# ⚖️ Barristrly CRM Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - USER_SCHEMA.md
> - BOOKING_SCHEMA.md
> - MEETING_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The CRM domain manages client relationships throughout their lifecycle.

It supports:

- Lead management
- Contact management
- Client organizations
- Matters (Cases)
- Pipelines
- Tasks
- Notes
- Timeline
- Tags
- Communication history
- AI relationship insights

The CRM serves as the operational memory of every lawyer and law firm using Barristrly.

---

# Domain Overview

```
Lead
 │
 ▼
Contact
 │
 ▼
Client
 │
 ├──────────────┐
 ▼              ▼
Matter       Timeline
 │              │
 ▼              ▼
Tasks      Communications
 │              │
 └──────┬───────┘
        ▼
    AI Insights
```

---

# Core Tables

1. crm_leads
2. crm_contacts
3. crm_organizations
4. crm_matters
5. crm_pipelines
6. crm_pipeline_stages
7. crm_tasks
8. crm_notes
9. crm_tags
10. crm_contact_tags
11. crm_timeline
12. crm_communications
13. crm_ai_insights

---

# Table: crm_leads

Purpose

Potential clients before conversion.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| full_name | TEXT |
| email | TEXT |
| phone | TEXT |
| source | TEXT |
| legal_issue | TEXT |
| status | lead_status |
| assigned_to | UUID |
| converted_contact_id | UUID NULL |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Lead Sources

- Website
- Referral
- WhatsApp
- Walk-in
- Social Media
- Advertisement
- AI Intake
- API

---

# Table: crm_contacts

Purpose

Primary CRM contact.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID NULL |
| lawyer_id | UUID |
| organization_id | UUID NULL |
| full_name | TEXT |
| email | TEXT |
| phone | TEXT |
| preferred_language | TEXT |
| status | contact_status |
| last_contacted_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

---

# Table: crm_organizations

Purpose

Businesses represented by contacts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| name | TEXT |
| industry | TEXT |
| website | TEXT |
| phone | TEXT |
| email | TEXT |
| address | TEXT |
| created_at | TIMESTAMPTZ |

---

# Table: crm_matters

Purpose

Legal matters managed for contacts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| contact_id | UUID |
| title | TEXT |
| description | TEXT |
| matter_type | TEXT |
| status | matter_status |
| priority | priority_level |
| opened_at | DATE |
| closed_at | DATE NULL |
| created_at | TIMESTAMPTZ |

---

# Table: crm_pipelines

Purpose

Custom sales or case pipelines.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| name | TEXT |
| description | TEXT |
| active | BOOLEAN |
| created_at | TIMESTAMPTZ |

---

# Table: crm_pipeline_stages

Purpose

Stages inside a pipeline.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| pipeline_id | UUID |
| name | TEXT |
| display_order | INTEGER |
| probability | INTEGER |

Example

- New Lead
- Consultation Scheduled
- Proposal Sent
- Negotiation
- Retained
- Closed Won
- Closed Lost

---

# Table: crm_tasks

Purpose

Follow-up activities.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| matter_id | UUID |
| assigned_to | UUID |
| title | TEXT |
| description | TEXT |
| due_date | TIMESTAMPTZ |
| priority | priority_level |
| status | task_status |
| completed_at | TIMESTAMPTZ NULL |

---

# Table: crm_notes

Purpose

Internal relationship notes.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| matter_id | UUID |
| author_id | UUID |
| note | TEXT |
| visibility | TEXT |
| created_at | TIMESTAMPTZ |

---

# Table: crm_tags

Purpose

Custom labels.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| name | TEXT |
| color | TEXT |
| created_at | TIMESTAMPTZ |

Examples

- VIP
- Urgent
- Corporate
- Litigation
- High Value
- Follow-Up

---

# Table: crm_contact_tags

Purpose

Many-to-many relationship.

### Columns

| Column | Type |
|---------|------|
| contact_id | UUID |
| tag_id | UUID |

Composite Unique

```
(contact_id, tag_id)
```

---

# Table: crm_timeline

Purpose

Unified chronological activity stream.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| contact_id | UUID |
| event_type | TEXT |
| reference_type | TEXT |
| reference_id | UUID |
| occurred_at | TIMESTAMPTZ |
| metadata | JSONB |

Timeline Examples

- Lead Created
- Consultation Booked
- Meeting Completed
- Invoice Paid
- Note Added
- Email Sent
- Document Uploaded

---

# Table: crm_communications

Purpose

Communication history.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| contact_id | UUID |
| channel | communication_channel |
| direction | communication_direction |
| subject | TEXT |
| message | TEXT |
| status | communication_status |
| sent_at | TIMESTAMPTZ |

Channels

- Email
- WhatsApp
- SMS
- Phone
- In-App Chat

---

# Table: crm_ai_insights

Purpose

AI-generated relationship intelligence.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| contact_id | UUID |
| relationship_score | NUMERIC(5,2) |
| churn_risk | NUMERIC(5,2) |
| lifetime_value_prediction | NUMERIC(12,2) |
| next_best_action | TEXT |
| sentiment | TEXT |
| generated_at | TIMESTAMPTZ |

---

# Relationships

```
Leads
   │
   ▼
Contacts
   │
 ┌─┼────────────┬──────────────┐
 ▼ ▼            ▼              ▼
Organizations Matters Timeline Communications
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Tasks    Notes   AI Insights
                 │
                 ▼
               Tags
```

---

# Enumerations

## lead_status

- new
- contacted
- qualified
- proposal_sent
- converted
- lost

---

## contact_status

- active
- inactive
- archived

---

## matter_status

- open
- pending
- on_hold
- resolved
- closed

---

## priority_level

- low
- medium
- high
- urgent

---

## task_status

- pending
- in_progress
- completed
- cancelled

---

## communication_channel

- email
- whatsapp
- sms
- phone
- in_app

---

## communication_direction

- inbound
- outbound

---

## communication_status

- pending
- sent
- delivered
- failed
- read

---

# AI Features

The CRM AI engine may provide:

- Lead qualification
- Client sentiment analysis
- Churn prediction
- Lifetime value estimation
- Next-best-action recommendations
- Automated follow-up suggestions
- Relationship health score
- Case priority recommendations

AI suggestions should remain explainable and reviewable by the user.

---

# Business Rules

- A lead may convert into one contact only.
- Every matter belongs to one contact.
- Every communication appears in the timeline.
- Tasks may relate to matters or follow-ups.
- Timeline events are immutable.
- AI insights are regenerated periodically.

---

# Row-Level Security

- Lawyers access only CRM records they own or are assigned to.
- Organization administrators may access CRM data for their organization.
- Platform administrators have support access subject to audit logging.
- Timeline entries are append-only.

---

# Background Jobs

- Lead scoring
- AI insight generation
- Follow-up reminders
- Pipeline analytics
- Timeline aggregation
- Contact deduplication
- Communication synchronization

---

# Integrations

- Booking domain
- Meeting domain
- Payments
- Notifications
- Email providers
- WhatsApp Business API
- AI services
- Analytics

---

# Future Enhancements

- Conflict checking
- Case document management
- E-signature workflows
- Client portals
- Automated intake forms
- Referral management
- Marketing automation
- AI case risk analysis
- Predictive workload balancing

---

# Success Criteria

The CRM domain must:

✓ Maintain a complete history of every client relationship.

✓ Support lead-to-client conversion.

✓ Centralize communications and activities.

✓ Provide actionable AI insights.

✓ Integrate seamlessly with bookings, meetings, payments, and notifications.

✓ Scale from solo practitioners to enterprise law firms.

This document is the authoritative specification for client relationship management within Barristrly.