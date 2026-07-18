# ⚖️ Barristrly Analytics Schema

> Version: 1.0
> Status: Approved
> Owner: Data & Analytics Team
> Depends On:
> - AUTH_SCHEMA.md
> - CRM_SCHEMA.md
> - BOOKING_SCHEMA.md
> - MEETING_SCHEMA.md
> - PAYMENT_SCHEMA.md
> - SUBSCRIPTION_SCHEMA.md
> - AI_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Analytics domain provides enterprise-grade reporting, metrics, dashboards,
forecasting, and business intelligence across the Barristrly platform.

It supports:

- Event Tracking
- Product Analytics
- User Analytics
- Revenue Analytics
- AI Analytics
- Operational Metrics
- KPI Snapshots
- Dashboard Widgets
- Cohort Analysis
- Funnel Analysis
- Forecasting
- Custom Reports
- Data Exports

The Analytics domain is **read-optimized** and should not be used for transactional writes.

---

# Domain Overview

```
Platform Events
       │
       ▼
 Event Pipeline
       │
       ▼
Analytics Events
       │
 ┌─────┼───────────────┬──────────────┐
 ▼     ▼               ▼              ▼
KPIs Dashboards     Funnels      Forecasts
 │
 ▼
Executive Reports
```

---

# Core Tables

1. analytics_events
2. analytics_sessions
3. analytics_page_views
4. analytics_kpi_snapshots
5. analytics_dashboards
6. analytics_dashboard_widgets
7. analytics_reports
8. analytics_funnels
9. analytics_funnel_steps
10. analytics_cohorts
11. analytics_ai_metrics
12. analytics_revenue_metrics
13. analytics_operational_metrics
14. analytics_exports
15. analytics_alerts

---

# Table: analytics_events

Purpose

Stores immutable business events.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| event_name | TEXT |
| organization_id | UUID NULL |
| profile_id | UUID NULL |
| entity_type | TEXT |
| entity_id | UUID |
| event_timestamp | TIMESTAMPTZ |
| metadata | JSONB |

Examples

- booking.created
- meeting.completed
- payment.succeeded
- subscription.renewed
- lawyer.verified
- ai.chat.completed

Events are append-only.

---

# Table: analytics_sessions

Purpose

Tracks authenticated user sessions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| session_start | TIMESTAMPTZ |
| session_end | TIMESTAMPTZ |
| device_type | TEXT |
| platform | TEXT |
| browser | TEXT |
| country | TEXT |
| city | TEXT |

---

# Table: analytics_page_views

Purpose

Measures UI engagement.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| session_id | UUID |
| route | TEXT |
| title | TEXT |
| duration_seconds | INTEGER |
| viewed_at | TIMESTAMPTZ |

---

# Table: analytics_kpi_snapshots

Purpose

Stores periodic KPI values.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| metric_name | TEXT |
| metric_value | NUMERIC(18,4) |
| aggregation_period | aggregation_period |
| organization_id | UUID NULL |
| snapshot_date | DATE |

Examples

- Monthly Revenue
- Daily Active Users
- Consultation Conversion Rate
- AI Cost
- Client Retention

---

# Table: analytics_dashboards

Purpose

Dashboard definitions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| owner_profile_id | UUID |
| visibility | dashboard_visibility |
| created_at | TIMESTAMPTZ |

---

# Table: analytics_dashboard_widgets

Purpose

Dashboard components.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| dashboard_id | UUID |
| widget_type | widget_type |
| title | TEXT |
| configuration | JSONB |
| display_order | INTEGER |

Examples

- Revenue Chart
- AI Usage
- Upcoming Meetings
- Case Status
- Payment Trends

---

# Table: analytics_reports

Purpose

Generated analytical reports.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| report_name | TEXT |
| report_type | report_type |
| generated_by | UUID |
| storage_path | TEXT |
| generated_at | TIMESTAMPTZ |

---

# Table: analytics_funnels

Purpose

Defines conversion funnels.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| active | BOOLEAN |

Examples

- Visitor → Signup
- Lead → Consultation
- Consultation → Paid Client
- Trial → Subscription

---

# Table: analytics_funnel_steps

Purpose

Ordered funnel stages.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| funnel_id | UUID |
| step_name | TEXT |
| step_order | INTEGER |
| event_name | TEXT |

---

# Table: analytics_cohorts

Purpose

Retention analysis groups.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| cohort_name | TEXT |
| definition | JSONB |
| created_at | TIMESTAMPTZ |

Examples

- Lawyers Joined July
- Enterprise Customers
- AI Power Users

---

# Table: analytics_ai_metrics

Purpose

Aggregated AI statistics.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| date | DATE |
| total_requests | INTEGER |
| total_tokens | BIGINT |
| average_latency_ms | INTEGER |
| average_cost | NUMERIC(12,6) |
| satisfaction_score | NUMERIC(5,2) |

---

# Table: analytics_revenue_metrics

Purpose

Financial KPIs.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID NULL |
| metric_date | DATE |
| mrr | NUMERIC(14,2) |
| arr | NUMERIC(14,2) |
| total_revenue | NUMERIC(14,2) |
| refunds | NUMERIC(14,2) |
| average_invoice | NUMERIC(14,2) |

---

# Table: analytics_operational_metrics

Purpose

Operational performance.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| metric_date | DATE |
| bookings_created | INTEGER |
| meetings_completed | INTEGER |
| average_response_time_ms | INTEGER |
| failed_jobs | INTEGER |
| notification_success_rate | NUMERIC(5,2) |
| ai_success_rate | NUMERIC(5,2) |

---

# Table: analytics_exports

Purpose

Tracks exported analytical datasets.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| export_type | TEXT |
| requested_by | UUID |
| storage_path | TEXT |
| status | export_status |
| created_at | TIMESTAMPTZ |

---

# Table: analytics_alerts

Purpose

Threshold-based monitoring.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| alert_name | TEXT |
| metric_name | TEXT |
| threshold_operator | TEXT |
| threshold_value | NUMERIC(18,4) |
| enabled | BOOLEAN |
| last_triggered_at | TIMESTAMPTZ NULL |

Examples

- Revenue Drop
- AI Cost Spike
- Payment Failure Rate
- Meeting Cancellation Surge

---

# Relationships

```
Platform Events
       │
       ▼
Analytics Events
 ┌──────┼─────────────┬─────────────┬────────────┐
 ▼      ▼             ▼             ▼
Sessions KPIs      Funnels     Revenue
 │
 ▼
Dashboards
 │
 ▼
Reports
```

---

# Enumerations

## aggregation_period

- hourly
- daily
- weekly
- monthly
- quarterly
- yearly

---

## dashboard_visibility

- private
- organization
- public

---

## widget_type

- metric
- line_chart
- bar_chart
- pie_chart
- table
- funnel
- heatmap
- gauge

---

## report_type

- executive
- operational
- financial
- ai
- compliance
- custom

---

## export_status

- pending
- processing
- completed
- failed

---

# Key Metrics

## Product

- Daily Active Users
- Monthly Active Users
- Session Duration
- Feature Adoption
- User Retention

---

## Marketplace

- Lawyer Signups
- Client Signups
- Booking Conversion
- Consultation Success Rate

---

## Financial

- MRR
- ARR
- Gross Revenue
- Net Revenue
- Refund Rate
- Average Transaction Value

---

## AI

- Requests
- Cost
- Latency
- Token Usage
- Satisfaction
- Tool Call Success Rate

---

## Operational

- Notification Delivery Rate
- Queue Processing Time
- API Response Time
- Background Job Success
- Error Rate

---

# Business Rules

- Analytics events are immutable.
- KPI snapshots are generated periodically.
- Reports are reproducible from source data.
- Dashboard widgets reference aggregated datasets rather than transactional tables.
- Historical analytics must never be overwritten.

---

# Row-Level Security

- Organizations access only their analytics.
- Platform administrators access global metrics.
- Dashboard sharing follows visibility rules.
- Exported reports inherit source data permissions.

---

# Background Jobs

- Event aggregation
- KPI snapshot generation
- Cohort calculation
- Funnel computation
- Forecast generation
- Dashboard cache refresh
- Scheduled report generation
- Data warehouse synchronization

---

# Integrations

- CRM
- Marketplace
- Meetings
- Bookings
- Payments
- Subscriptions
- AI
- Notifications
- Audit Logs

---

# Future Enhancements

- Predictive analytics
- AI-generated executive summaries
- Real-time streaming dashboards
- Data warehouse connectors
- Embedded BI
- Customer health scoring
- Revenue forecasting
- Capacity planning
- Anomaly detection

---

# Success Criteria

The Analytics domain must:

✓ Provide trusted business intelligence across the platform.

✓ Scale to millions of analytical events.

✓ Deliver near real-time dashboards and KPI reporting.

✓ Support executive, operational, financial, and AI analytics.

✓ Maintain immutable historical data for trend analysis and forecasting.

✓ Enable data-driven decision-making for solo lawyers, law firms, and enterprise organizations.

This document is the authoritative specification for analytics, reporting, and business intelligence within Barristrly.