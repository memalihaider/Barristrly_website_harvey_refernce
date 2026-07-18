# ⚖️ Barristrly Identity Schema

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Depends On:
> - AUTH_SCHEMA.md
> - DATABASE_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

The Identity domain defines every person and organization that exists inside Barristrly.

Authentication answers:

> "Who can log in?"

Identity answers:

> "Who are they?"

This schema stores business information rather than authentication credentials.

---

# Domain Overview

```
auth.users
      │
      ▼
profiles
      │
      ├──────────────┐
      ▼              ▼
clients         lawyers
      │              │
      ▼              ▼
client_addresses lawyer_specializations
      │              │
      ▼              ▼
documents      licenses
      │
      ▼
organizations
```

---

# Core Tables

1. profiles
2. organizations
3. clients
4. lawyers
5. lawyer_specializations
6. lawyer_languages
7. lawyer_licenses
8. lawyer_availability
9. client_addresses
10. emergency_contacts
11. profile_documents

---

# Table: organizations

Purpose

Represents law firms and future enterprise customers.

### Columns

| Column | Type | Notes |
|---------|------|------|
| id | UUID | PK |
| name | TEXT | Required |
| legal_name | TEXT | |
| registration_number | TEXT | |
| tax_number | TEXT | |
| email | TEXT | |
| phone | TEXT | |
| website | TEXT | |
| logo_url | TEXT | |
| country | TEXT | |
| city | TEXT | |
| address | TEXT | |
| status | organization_status | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

# Table: clients

Purpose

Stores client-specific information.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| organization_id | UUID NULL |
| client_type | client_type |
| preferred_contact_method | TEXT |
| preferred_language | TEXT |
| onboarding_completed | BOOLEAN |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: lawyers

Purpose

Stores professional information.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| organization_id | UUID NULL |
| biography | TEXT |
| years_of_experience | INTEGER |
| consultation_fee | NUMERIC(10,2) |
| currency | TEXT |
| verification_status | verification_status |
| profile_visibility | BOOLEAN |
| accepting_clients | BOOLEAN |
| average_rating | NUMERIC(3,2) |
| review_count | INTEGER |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: lawyer_specializations

Purpose

Stores legal practice areas.

Examples

- Corporate Law
- Criminal Law
- Family Law
- Immigration
- Intellectual Property
- Employment Law
- Civil Litigation

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| specialization | TEXT |
| primary_specialization | BOOLEAN |

---

# Table: lawyer_languages

Purpose

Languages spoken.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| language | TEXT |
| proficiency | language_level |

---

# Table: lawyer_licenses

Purpose

Professional licenses.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| license_number | TEXT |
| issuing_authority | TEXT |
| jurisdiction | TEXT |
| issue_date | DATE |
| expiry_date | DATE |
| verification_document | TEXT |

---

# Table: lawyer_availability

Purpose

Weekly availability.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| lawyer_id | UUID |
| weekday | SMALLINT |
| start_time | TIME |
| end_time | TIME |
| timezone | TEXT |

---

# Table: client_addresses

Purpose

Client billing and contact addresses.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| client_id | UUID |
| address_type | TEXT |
| country | TEXT |
| city | TEXT |
| state | TEXT |
| postal_code | TEXT |
| address_line_1 | TEXT |
| address_line_2 | TEXT |

---

# Table: emergency_contacts

Purpose

Optional emergency contacts.

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| full_name | TEXT |
| relationship | TEXT |
| phone | TEXT |
| email | TEXT |

---

# Table: profile_documents

Purpose

Identity documents.

Examples

- Passport
- National ID
- Bar License
- Company Registration
- Utility Bill

### Columns

| Column | Type |
|---------|------|
| id | UUID |
| profile_id | UUID |
| document_type | TEXT |
| storage_path | TEXT |
| verification_status | verification_status |
| uploaded_at | TIMESTAMPTZ |

---

# Relationships

```
profiles
│
├── clients
│   └── client_addresses
│
├── lawyers
│   ├── lawyer_languages
│   ├── lawyer_specializations
│   ├── lawyer_licenses
│   └── lawyer_availability
│
├── emergency_contacts
│
└── profile_documents

organizations
│
├── lawyers
└── clients
```

---

# Enumerations

## client_type

- individual
- business

---

## verification_status

- pending
- under_review
- verified
- rejected
- suspended

---

## organization_status

- pending
- active
- suspended
- archived

---

## language_level

- native
- fluent
- professional
- conversational
- basic

---

# Indexes

Create indexes for:

- profile_id
- organization_id
- verification_status
- accepting_clients
- specialization
- average_rating
- country
- city

Composite indexes:

```
(verification_status, accepting_clients)

(country, city)

(specialization, verification_status)
```

---

# Row-Level Security

Profiles

- Users may read and update their own profile.
- Administrators may manage all profiles.

Clients

- Users may only access their own client record.
- Staff roles may access records according to assigned permissions.

Lawyers

- Public users may view only approved public profiles.
- Lawyers may edit their own professional information.
- Mediators and administrators may review, verify, or suspend lawyer records.

Organizations

- Organization administrators may manage their organization.
- Platform administrators retain full access.

---

# Business Rules

- Every authenticated account must have one profile.
- A profile may represent a client, a lawyer, or both if the business permits multiple roles.
- Lawyers must be verified before appearing in search results.
- Public listings include only active and verified lawyers.
- Organizations may contain multiple lawyers.
- Professional licenses must remain valid for a lawyer to maintain verified status.

---

# Future Enhancements

- Multi-office law firms
- Team hierarchies
- Department management
- Professional certifications
- Digital signature verification
- External bar association verification APIs
- Public profile version history

---

# Success Criteria

The Identity domain must:

✓ Represent every user consistently.

✓ Support individuals and organizations.

✓ Enable professional verification workflows.

✓ Integrate cleanly with authentication.

✓ Scale to multi-office law firms.

✓ Provide a stable identity foundation for all remaining Barristrly modules.