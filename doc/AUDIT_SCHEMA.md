# ⚖️ Barristrly Audit Schema

> Version: 1.0
> Status: Approved
> Owner: Security & Compliance Team
> Depends On:
> - AUTH_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> - STORAGE_SCHEMA.md
> - SETTINGS_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

The Audit domain provides immutable logging and compliance monitoring across the Barristrly platform.

It supports:

- Audit Events
- Entity Change History
- Security Events
- Login Activity
- API Audit Logs
- Administrative Actions
- Data Access Logs
- Compliance Reports
- Legal Hold Events
- Chain of Custody
- Tamper Detection
- Forensic Investigations

The Audit domain is append-only and serves as the authoritative source for historical activity.

---

# Core Principles

The audit system must guarantee:

✓ Immutability

✓ Traceability

✓ Non-repudiation

✓ Complete historical reconstruction

✓ Compliance readiness

✓ Forensic investigation support

---

# Architecture Overview

```
Application Event
        │
        ▼
 Audit Collector
        │
        ▼
 Append-Only Event Store
        │
 ┌──────┼─────────────┬───────────────┐
 ▼      ▼             ▼               ▼
Entity Security    Access Logs   Compliance
Changes Events
        │
        ▼
 Investigation Portal
```

---

# Core Tables

1. audit_events
2. audit_entity_changes
3. audit_user_activity
4. audit_security_events
5. audit_login_history
6. audit_api_requests
7. audit_admin_actions
8. audit_data_access
9. audit_chain_of_custody
10. audit_legal_holds
11. audit_compliance_reports
12. audit_integrity_checks

---

# Table: audit_events

Purpose

Master append-only audit stream.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| event_type | audit_event_type |
| actor_id | UUID NULL |
| organization_id | UUID NULL |
| entity_type | TEXT |
| entity_id | UUID |
| action | TEXT |
| occurred_at | TIMESTAMPTZ |
| correlation_id | UUID |
| metadata | JSONB |

This table is never updated or deleted.

---

# Table: audit_entity_changes

Purpose

Tracks before/after changes.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| audit_event_id | UUID |
| entity_type | TEXT |
| entity_id | UUID |
| field_name | TEXT |
| old_value | JSONB |
| new_value | JSONB |

Sensitive values should be masked where required.

---

# Table: audit_user_activity

Purpose

User behavior timeline.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| activity_type | TEXT |
| ip_address | INET |
| user_agent | TEXT |
| device | TEXT |
| occurred_at | TIMESTAMPTZ |

Examples

- Opened Matter
- Downloaded Contract
- Viewed Invoice
- Generated AI Summary

---

# Table: audit_security_events

Purpose

Security monitoring.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| severity | security_severity |
| profile_id | UUID NULL |
| ip_address | INET |
| event_name | TEXT |
| description | TEXT |
| resolved | BOOLEAN |
| detected_at | TIMESTAMPTZ |

Examples

- Failed Login
- MFA Disabled
- Password Reset
- Suspicious Location
- Privilege Escalation

---

# Table: audit_login_history

Purpose

Authentication history.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| login_method | TEXT |
| success | BOOLEAN |
| ip_address | INET |
| country | TEXT |
| city | TEXT |
| device | TEXT |
| login_at | TIMESTAMPTZ |

---

# Table: audit_api_requests

Purpose

API observability.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| request_id | UUID |
| profile_id | UUID NULL |
| api_key_id | UUID NULL |
| method | TEXT |
| endpoint | TEXT |
| response_code | INTEGER |
| latency_ms | INTEGER |
| ip_address | INET |
| created_at | TIMESTAMPTZ |

---

# Table: audit_admin_actions

Purpose

Administrative activity.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| administrator_id | UUID |
| action | TEXT |
| target_entity | TEXT |
| target_entity_id | UUID |
| reason | TEXT |
| performed_at | TIMESTAMPTZ |

Examples

- User Suspended
- Subscription Upgraded
- Feature Flag Enabled
- Role Assigned

---

# Table: audit_data_access

Purpose

Tracks sensitive data access.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| resource_type | TEXT |
| resource_id | UUID |
| access_type | data_access_type |
| ip_address | INET |
| occurred_at | TIMESTAMPTZ |

Examples

- Client Profile Viewed
- Identity Document Downloaded
- Meeting Recording Played
- AI Transcript Accessed

---

# Table: audit_chain_of_custody

Purpose

Legal evidence tracking.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| storage_file_id | UUID |
| custody_action | custody_action |
| performed_by | UUID |
| checksum_sha256 | TEXT |
| timestamp | TIMESTAMPTZ |
| notes | TEXT |

Examples

- Uploaded
- Verified
- Exported
- Presented in Court

---

# Table: audit_legal_holds

Purpose

Prevents deletion of records.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| entity_type | TEXT |
| entity_id | UUID |
| reason | TEXT |
| applied_by | UUID |
| applied_at | TIMESTAMPTZ |
| released_at | TIMESTAMPTZ NULL |

---

# Table: audit_compliance_reports

Purpose

Generated compliance reports.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| report_type | compliance_report_type |
| generated_by | UUID |
| storage_path | TEXT |
| generated_at | TIMESTAMPTZ |

Examples

- GDPR Export
- Access Log
- Security Report
- Audit Summary

---

# Table: audit_integrity_checks

Purpose

Detects tampering.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| verification_scope | TEXT |
| expected_hash | TEXT |
| actual_hash | TEXT |
| verified | BOOLEAN |
| verified_at | TIMESTAMPTZ |

---

# Relationships

```
Application Events
        │
        ▼
Audit Events
 ┌──────┼──────────────┬──────────────┬─────────────┐
 ▼      ▼              ▼              ▼
Entity Security      API         User Activity
Changes Events      Requests
 │
 ▼
Chain of Custody
 │
 ▼
Compliance Reports
```

---

# Enumerations

## audit_event_type

- create
- update
- delete
- read
- export
- login
- logout
- permission_change
- system

---

## security_severity

- informational
- low
- medium
- high
- critical

---

## data_access_type

- read
- export
- download
- print

---

## custody_action

- uploaded
- verified
- transferred
- exported
- archived
- restored
- destroyed

---

## compliance_report_type

- gdpr
- security
- audit
- access_log
- legal_hold
- custom

---

# Chain of Custody Workflow

```
Upload
   │
   ▼
Checksum Generated
   │
   ▼
Audit Event Recorded
   │
   ▼
Evidence Access Logged
   │
   ▼
Court Export Logged
```

Every transfer of evidence must be recorded.

---

# Business Rules

- Audit records are immutable.
- Updates create new audit entries rather than modifying existing records.
- Sensitive values are masked or encrypted where required.
- Legal holds prevent deletion until explicitly released.
- Correlation IDs connect related events across services.
- Integrity checks run periodically to detect tampering.

---

# Row-Level Security

- Users may view their own activity logs where permitted.
- Organization administrators may access organization-level audit records.
- Compliance officers have read-only access to audit data.
- Platform administrators manage audit retention policies.
- No role may modify or delete audit records.

---

# Background Jobs

- Audit event ingestion
- Integrity verification
- Compliance report generation
- Retention policy enforcement
- Legal hold validation
- Suspicious activity detection
- Audit archive migration

---

# Integrations

- Authentication
- Storage
- CRM
- Meetings
- Payments
- AI
- Notifications
- Analytics
- SIEM platforms (future)

---

# Compliance Support

Designed to support:

- GDPR
- ISO 27001
- SOC 2
- PCI DSS (where applicable)
- Regional privacy regulations
- Internal legal and forensic requirements

---

# Future Enhancements

- Cryptographic event signing
- Merkle tree verification
- Blockchain-backed audit proofs
- Real-time SIEM integration
- UEBA (User & Entity Behavior Analytics)
- Automated insider threat detection
- Cross-region audit replication

---

# Success Criteria

The Audit domain must:

✓ Maintain an immutable history of every critical platform event.

✓ Enable complete forensic reconstruction of user and system activity.

✓ Provide legally defensible chain-of-custody records.

✓ Support enterprise compliance and regulatory reporting.

✓ Detect unauthorized modification or tampering.

✓ Scale to billions of audit events without compromising integrity or performance.

This document is the authoritative specification for auditing, compliance, and forensic event tracking within Barristrly.