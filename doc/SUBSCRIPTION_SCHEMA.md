# ⚖️ Barristrly Subscription Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - PAYMENT_SCHEMA.md
> - AUTH_SCHEMA.md
> - USER_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Subscription domain manages licensing, plans, billing cycles, feature access, usage limits, and entitlements.

It supports:

- Subscription plans
- Billing cycles
- Free trials
- Enterprise licensing
- Add-ons
- Feature flags
- Usage tracking
- Team seats
- AI usage quotas
- Overage billing
- Subscription lifecycle

The Subscription domain determines **what customers can access**, while the Payment domain determines **how they pay**.

---

# Domain Overview

```
Organization
      │
      ▼
Subscription
      │
 ┌────┼──────────────┬─────────────┐
 ▼    ▼              ▼             ▼
Plan Features     Usage        Billing Cycle
 │                 │
 ▼                 ▼
Entitlements   AI Quotas
      │
      ▼
Platform Access
```

---

# Core Tables

1. subscription_plans
2. subscription_features
3. plan_features
4. subscriptions
5. subscription_cycles
6. subscription_usage
7. feature_entitlements
8. subscription_addons
9. subscription_trials
10. team_seats
11. ai_usage
12. overage_charges

---

# Table: subscription_plans

Purpose

Defines available pricing plans.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| slug | TEXT UNIQUE |
| description | TEXT |
| monthly_price | NUMERIC(12,2) |
| yearly_price | NUMERIC(12,2) |
| currency | TEXT |
| plan_type | plan_type |
| active | BOOLEAN |
| created_at | TIMESTAMPTZ |

### Example Plans

- Free
- Starter
- Professional
- Business
- Enterprise

---

# Table: subscription_features

Purpose

Master list of platform capabilities.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| code | TEXT UNIQUE |
| name | TEXT |
| description | TEXT |
| category | TEXT |

Examples

- ai_chat
- ai_summary
- video_meetings
- crm
- analytics
- marketplace
- api_access
- document_storage

---

# Table: plan_features

Purpose

Maps features to plans.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| plan_id | UUID |
| feature_id | UUID |
| enabled | BOOLEAN |
| usage_limit | INTEGER NULL |
| reset_period | TEXT |

Examples

- 100 meetings/month
- Unlimited CRM
- 50 AI summaries/day

---

# Table: subscriptions

Purpose

Customer subscription.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| plan_id | UUID |
| payment_customer_id | TEXT |
| status | subscription_status |
| billing_cycle | billing_cycle |
| current_period_start | TIMESTAMPTZ |
| current_period_end | TIMESTAMPTZ |
| auto_renew | BOOLEAN |
| cancelled_at | TIMESTAMPTZ NULL |
| created_at | TIMESTAMPTZ |

---

# Table: subscription_cycles

Purpose

Billing history.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| cycle_number | INTEGER |
| period_start | TIMESTAMPTZ |
| period_end | TIMESTAMPTZ |
| invoice_id | UUID |
| status | cycle_status |

---

# Table: subscription_usage

Purpose

Feature usage tracking.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| feature_id | UUID |
| usage_count | INTEGER |
| usage_period_start | DATE |
| usage_period_end | DATE |
| updated_at | TIMESTAMPTZ |

---

# Table: feature_entitlements

Purpose

Effective permissions after plan, add-ons, and overrides.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| feature_id | UUID |
| enabled | BOOLEAN |
| effective_limit | INTEGER |
| source | entitlement_source |
| updated_at | TIMESTAMPTZ |

---

# Table: subscription_addons

Purpose

Optional purchased extensions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| addon_name | TEXT |
| quantity | INTEGER |
| monthly_price | NUMERIC(12,2) |
| active | BOOLEAN |

Examples

- Extra AI Credits
- Additional Team Seats
- Extra Storage
- Premium Support

---

# Table: subscription_trials

Purpose

Trial management.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| plan_id | UUID |
| starts_at | TIMESTAMPTZ |
| ends_at | TIMESTAMPTZ |
| converted | BOOLEAN |
| converted_subscription_id | UUID NULL |

---

# Table: team_seats

Purpose

Licensed user seats.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| profile_id | UUID |
| seat_type | TEXT |
| assigned_at | TIMESTAMPTZ |

---

# Table: ai_usage

Purpose

AI consumption tracking.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| model_name | TEXT |
| feature | TEXT |
| input_tokens | INTEGER |
| output_tokens | INTEGER |
| estimated_cost | NUMERIC(12,6) |
| recorded_at | TIMESTAMPTZ |

---

# Table: overage_charges

Purpose

Charges exceeding plan limits.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| subscription_id | UUID |
| feature_id | UUID |
| quantity | INTEGER |
| unit_price | NUMERIC(12,4) |
| total_amount | NUMERIC(12,2) |
| invoiced | BOOLEAN |

---

# Relationships

```
Subscription Plans
        │
        ▼
Plan Features
        │
        ▼
Subscriptions
 ┌──────┼──────────────┬────────────┬──────────────┐
 ▼      ▼              ▼            ▼              ▼
Cycles Usage     Entitlements  Add-ons       Team Seats
                            │
                            ▼
                        AI Usage
                            │
                            ▼
                     Overage Charges
```

---

# Enumerations

## plan_type

- free
- standard
- professional
- business
- enterprise

---

## subscription_status

- trial
- active
- past_due
- suspended
- cancelled
- expired

---

## billing_cycle

- monthly
- yearly

---

## cycle_status

- open
- invoiced
- paid
- overdue

---

## entitlement_source

- plan
- addon
- manual_override
- promotion

---

# Subscription Lifecycle

```
Trial
   │
   ▼
Active
   │
 ┌─┴─────────────┐
 ▼               ▼
Renew         Upgrade
 │               │
 ▼               ▼
Downgrade   Cancellation
 │
 ▼
Expired
```

---

# Business Rules

- One active subscription per organization.
- Plans define default feature access.
- Effective access is calculated through entitlements.
- Usage resets according to each feature's reset period.
- Overage billing is optional and configurable.
- Team seats cannot exceed purchased licenses.
- AI usage contributes to quotas and cost reporting.

---

# AI Usage Management

Track usage for:

- Prompt tokens
- Completion tokens
- Speech transcription
- Embeddings
- AI summaries
- Legal research
- Document analysis

AI costs should be attributable to organizations and subscriptions.

---

# Row-Level Security

Organizations

- View and manage only their own subscriptions.

Administrators

- Full access.

Platform Billing Team

- Read financial metadata.
- Manage plan assignments.
- Override entitlements when authorized.

---

# Background Jobs

- Subscription renewal
- Trial expiration
- Usage reset
- Overage calculation
- Seat validation
- AI quota reconciliation
- Entitlement cache refresh
- Billing synchronization

---

# Integrations

- Payment domain
- Accounting domain
- Authentication
- Feature Flag service
- Analytics
- AI services
- Notification service

---

# Future Enhancements

- Regional pricing
- Usage-based billing
- Hybrid subscriptions
- Contract billing
- Volume discounts
- Marketplace partner plans
- White-label licensing
- Multi-tenant enterprise agreements
- Revenue forecasting

---

# Success Criteria

The Subscription domain must:

✓ Enforce platform access consistently.

✓ Support flexible SaaS pricing models.

✓ Track usage accurately.

✓ Scale from individual lawyers to enterprise organizations.

✓ Integrate seamlessly with payments, accounting, AI, and analytics.

✓ Provide a reliable foundation for feature entitlement and commercial operations.

This document is the authoritative specification for subscription management and licensing within Barristrly.