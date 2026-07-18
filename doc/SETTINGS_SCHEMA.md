# ⚖️ Barristrly Settings Schema

> Version: 1.0
> Status: Approved
> Owner: Platform Engineering Team
> Depends On:
> - AUTH_SCHEMA.md
> - USER_SCHEMA.md
> - SUBSCRIPTION_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Settings domain manages configurable behavior across the Barristrly platform.

It supports:

- Organization Settings
- User Preferences
- Localization
- Branding & White Label
- Security Policies
- Authentication Settings
- AI Configuration
- Notification Defaults
- Payment Settings
- Feature Flags
- API Integrations
- Compliance Configuration
- System Settings

The Settings domain acts as the configuration registry for every other module.

---

# Domain Overview

```
Platform
    │
    ▼
System Settings
    │
 ┌──┼───────────────┬───────────────┬─────────────┐
 ▼  ▼               ▼               ▼
Organization     User         Security      AI
 │                │
 ▼                ▼
Branding     Preferences
 │
 ▼
Feature Resolution
```

---

# Core Tables

1. system_settings
2. organization_settings
3. user_preferences
4. localization_settings
5. branding_settings
6. security_settings
7. authentication_settings
8. ai_settings
9. notification_settings
10. payment_settings
11. feature_flags
12. integration_settings
13. compliance_settings
14. audit_configuration

---

# Table: system_settings

Purpose

Global platform configuration.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| setting_key | TEXT UNIQUE |
| setting_value | JSONB |
| description | TEXT |
| editable | BOOLEAN |
| updated_by | UUID |
| updated_at | TIMESTAMPTZ |

Examples

- maintenance_mode
- registration_enabled
- max_upload_size
- support_email
- default_timezone

---

# Table: organization_settings

Purpose

Organization-specific configuration.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| timezone | TEXT |
| locale | TEXT |
| currency | TEXT |
| date_format | TEXT |
| time_format | TEXT |
| business_hours | JSONB |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: user_preferences

Purpose

Personal user settings.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| language | TEXT |
| timezone | TEXT |
| theme | ui_theme |
| landing_page | TEXT |
| accessibility | JSONB |
| updated_at | TIMESTAMPTZ |

Examples

- Light/Dark Mode
- Dashboard Layout
- Keyboard Shortcuts
- Accessibility Preferences

---

# Table: localization_settings

Purpose

Regional behavior.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| country | TEXT |
| locale | TEXT |
| currency | TEXT |
| first_day_of_week | SMALLINT |
| weekend_days | JSONB |
| active | BOOLEAN |

---

# Table: branding_settings

Purpose

White-label customization.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| company_name | TEXT |
| logo_path | TEXT |
| favicon_path | TEXT |
| primary_color | TEXT |
| secondary_color | TEXT |
| email_header | TEXT |
| custom_domain | TEXT |
| created_at | TIMESTAMPTZ |

---

# Table: security_settings

Purpose

Organization security policies.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| password_policy | JSONB |
| session_timeout_minutes | INTEGER |
| require_mfa | BOOLEAN |
| ip_allowlist | JSONB |
| login_attempt_limit | INTEGER |
| updated_at | TIMESTAMPTZ |

---

# Table: authentication_settings

Purpose

Authentication configuration.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID NULL |
| allow_google | BOOLEAN |
| allow_microsoft | BOOLEAN |
| allow_magic_link | BOOLEAN |
| allow_email_password | BOOLEAN |
| allow_sso | BOOLEAN |
| updated_at | TIMESTAMPTZ |

---

# Table: ai_settings

Purpose

Organization AI preferences.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| default_model | TEXT |
| ai_enabled | BOOLEAN |
| auto_summarization | BOOLEAN |
| auto_translation | BOOLEAN |
| prompt_overrides | JSONB |
| updated_at | TIMESTAMPTZ |

---

# Table: notification_settings

Purpose

Default communication behavior.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| default_email_enabled | BOOLEAN |
| default_sms_enabled | BOOLEAN |
| default_whatsapp_enabled | BOOLEAN |
| reminder_schedule | JSONB |
| updated_at | TIMESTAMPTZ |

---

# Table: payment_settings

Purpose

Financial configuration.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| default_currency | TEXT |
| tax_enabled | BOOLEAN |
| invoice_prefix | TEXT |
| payment_terms_days | INTEGER |
| gateway_configuration | JSONB |
| updated_at | TIMESTAMPTZ |

---

# Table: feature_flags

Purpose

Feature enablement and staged rollouts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| feature_key | TEXT UNIQUE |
| organization_id | UUID NULL |
| enabled | BOOLEAN |
| rollout_percentage | INTEGER |
| conditions | JSONB |
| updated_at | TIMESTAMPTZ |

Examples

- ai_document_review
- beta_dashboard
- new_marketplace
- voice_assistant

---

# Table: integration_settings

Purpose

Third-party integrations.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| integration_name | TEXT |
| configuration | JSONB |
| active | BOOLEAN |
| last_verified_at | TIMESTAMPTZ |

Examples

- Google Calendar
- Microsoft 365
- Stripe
- Resend
- WhatsApp
- Zoom

Secrets should reference encrypted secret storage rather than storing credentials directly.

---

# Table: compliance_settings

Purpose

Legal and regulatory configuration.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID |
| data_retention_days | INTEGER |
| privacy_policy_version | TEXT |
| terms_version | TEXT |
| gdpr_enabled | BOOLEAN |
| regional_requirements | JSONB |
| updated_at | TIMESTAMPTZ |

---

# Table: audit_configuration

Purpose

Audit logging policies.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| organization_id | UUID NULL |
| log_retention_days | INTEGER |
| sensitive_events | JSONB |
| export_enabled | BOOLEAN |
| created_at | TIMESTAMPTZ |

---

# Relationships

```
System Settings
       │
       ▼
Organization Settings
 ┌─────┼─────────────┬──────────────┬──────────────┐
 ▼     ▼             ▼              ▼
Branding Security   AI         Notifications
 │
 ▼
Feature Flags
 │
 ▼
Platform Behavior
```

---

# Enumerations

## ui_theme

- system
- light
- dark

---

# Configuration Resolution Order

When a setting exists at multiple levels, resolve it in this order:

```
User Preference
        │
        ▼
Organization Setting
        │
        ▼
System Setting
        │
        ▼
Application Default
```

This ensures tenant customization without duplicating global defaults.

---

# Business Rules

- System settings apply platform-wide unless overridden.
- Organization settings override system defaults.
- User preferences override organization settings where applicable.
- Feature flags can be global or tenant-specific.
- Sensitive configuration values must reference encrypted secret storage.
- Configuration changes should trigger cache invalidation where required.

---

# Row-Level Security

- Users may manage only their own preferences.
- Organization administrators manage organization-level settings.
- Platform administrators manage global configuration.
- Security and compliance settings require elevated permissions.

---

# Background Jobs

- Configuration cache refresh
- Feature flag propagation
- Integration health checks
- Secret rotation reminders
- Compliance policy validation
- Timezone synchronization

---

# Integrations

- Authentication
- AI
- Notifications
- Payments
- Analytics
- CRM
- Marketplace
- Booking
- Meetings
- External identity providers

---

# Future Enhancements

- Dynamic configuration service
- Real-time feature flag evaluation
- Multi-region configuration replication
- Policy-as-code support
- Environment-specific overrides
- Configuration version history
- Configuration approval workflows
- Tenant configuration templates

---

# Success Criteria

The Settings domain must:

✓ Provide a single source of truth for platform configuration.

✓ Support hierarchical configuration inheritance.

✓ Enable secure tenant customization.

✓ Scale across thousands of organizations.

✓ Integrate consistently with every Barristrly domain.

✓ Maintain secure, auditable, and versionable configuration management.

This document is the authoritative specification for configuration and platform settings within Barristrly.