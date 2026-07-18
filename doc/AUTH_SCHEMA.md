# ⚖️ Barristrly Authentication Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - DATABASE_ARCHITECTURE.md
> - DATABASE_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

This document defines the authentication and authorization data model for Barristrly.

Authentication is provided by **Supabase Auth**.

Barristrly extends the authentication system with:

- User profiles
- Roles
- Permissions
- Role assignments
- MFA preferences
- Devices
- Login history

Passwords, refresh tokens, email verification and sessions remain managed by Supabase.

---

# Authentication Architecture

```
Supabase Auth
│
├── auth.users
├── auth.sessions
├── auth.identities
└── auth.mfa
        │
        ▼
Barristrly Public Schema
│
├── profiles
├── roles
├── permissions
├── role_permissions
├── user_roles
├── user_devices
├── login_history
└── security_events
```

---

# Authentication Flow

```
Register

↓

Supabase Auth

↓

Email Verification

↓

Create Profile

↓

Assign Default Role

↓

Onboarding

↓

Dashboard
```

---

# Table: profiles

Purpose

Stores application-specific user information.

### Columns

| Column | Type | Required | Notes |
|---------|------|----------|------|
| id | UUID | Yes | PK, FK → auth.users.id |
| first_name | TEXT | Yes | |
| last_name | TEXT | Yes | |
| avatar_url | TEXT | No | |
| phone | TEXT | No | E.164 format |
| preferred_language | TEXT | Yes | Default `en` |
| timezone | TEXT | Yes | IANA timezone |
| country_code | TEXT | No | ISO 3166-1 alpha-2 |
| status | user_status | Yes | Enum |
| email_notifications | BOOLEAN | Yes | Default true |
| push_notifications | BOOLEAN | Yes | Default true |
| marketing_opt_in | BOOLEAN | Yes | Default false |
| created_at | TIMESTAMPTZ | Yes | |
| updated_at | TIMESTAMPTZ | Yes | |

### Indexes

```
idx_profiles_status
idx_profiles_country
idx_profiles_created_at
```

---

# Table: roles

Purpose

Defines platform roles.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| is_system | BOOLEAN |
| created_at | TIMESTAMPTZ |

### Seed Data

```
client

lawyer

mediator

admin

super_admin
```

---

# Table: permissions

Purpose

Defines granular platform permissions.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| code | TEXT |
| module | TEXT |
| description | TEXT |
| created_at | TIMESTAMPTZ |

### Examples

```
users.view

users.edit

users.delete

meetings.create

meetings.cancel

payments.refund

crm.export

ai.manage

reports.view
```

Permission codes must be unique.

---

# Table: role_permissions

Many-to-many relationship.

```
roles

↓

role_permissions

↓

permissions
```

Columns

| Column | Type |
|---------|------|
| role_id | UUID |
| permission_id | UUID |

Composite unique constraint:

```
(role_id, permission_id)
```

---

# Table: user_roles

Purpose

Supports users having multiple roles if required.

Columns

| Column | Type |
|---------|------|
| user_id | UUID |
| role_id | UUID |
| assigned_by | UUID |
| assigned_at | TIMESTAMPTZ |

Composite unique key:

```
(user_id, role_id)
```

---

# Table: user_devices

Purpose

Stores trusted devices for security monitoring.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| device_name | TEXT |
| platform | TEXT |
| browser | TEXT |
| ip_address | INET |
| last_seen_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

Passwords or session tokens must never be stored.

---

# Table: login_history

Purpose

Security audit trail.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| login_at | TIMESTAMPTZ |
| ip_address | INET |
| country | TEXT |
| city | TEXT |
| user_agent | TEXT |
| success | BOOLEAN |
| failure_reason | TEXT NULL |

This table is append-only.

---

# Table: security_events

Purpose

Tracks security-sensitive actions.

Examples

- MFA enabled
- Password changed
- Email changed
- Role assigned
- Suspicious login
- Account locked

Columns

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| event_type | TEXT |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

---

# Relationships

```
auth.users
      │
      │ 1:1
      ▼
profiles
      │
      │ M:N
      ▼
user_roles
      │
      ▼
roles
      │
      ▼
role_permissions
      │
      ▼
permissions

profiles
├── user_devices
├── login_history
└── security_events
```

---

# Row-Level Security

## profiles

Users may:

- View their own profile.
- Update their own profile.

Admins may:

- View all profiles.
- Suspend users.
- Update status.

---

## user_roles

Readable by:

- Owner
- Admins

Writable by:

- Super Admin only

---

## permissions

Read-only for authenticated users.

Write access:

Super Admin only.

---

## login_history

Users may view only their own records.

Admins may view all.

No updates permitted.

---

# Triggers

## Create Profile

Trigger

```
auth.users

↓

profiles
```

Automatically creates a profile after successful registration.

---

## Update Timestamp

Automatically updates:

```
updated_at
```

on every profile modification.

---

# Business Rules

- Every authenticated account must have exactly one profile.
- Every user must have at least one role.
- Roles determine permissions through role-permission mappings.
- Permission checks must occur in the application layer and be reinforced by RLS where applicable.
- Security events are immutable.

---

# Seed Data

Initial roles:

- Client
- Lawyer
- Mediator
- Admin
- Super Admin

Initial permissions should cover:

- Authentication
- User Management
- Marketplace
- Meetings
- CRM
- Payments
- AI
- Reports
- Settings

---

# Success Criteria

The authentication schema must:

- Integrate cleanly with Supabase Auth.
- Support role-based access control.
- Maintain complete auditability.
- Scale to additional roles and permissions.
- Enforce least-privilege access.
- Provide a secure foundation for all other Barristrly modules.

This schema is the authoritative reference for authentication and authorization within the Barristrly platform.