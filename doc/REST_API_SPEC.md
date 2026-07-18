# ⚖️ Barristrly REST API Specification

> Version: 1.0
> Status: Approved
> Owner: Backend Engineering Team
> Depends On:
> - API_ARCHITECTURE.md
> - ERD.md
> - All Schema Documents
> Last Updated: July 2026

---

# Purpose

This document defines every REST API exposed by Barristrly.

It specifies:

- Endpoint inventory
- Resource organization
- Authentication
- Authorization
- Permissions
- Request/Response conventions
- Versioning
- Error behavior

All endpoints are prefixed with:

```
/api/v1
```

---

# API Domains

```
Authentication

Identity

Organizations

Marketplace

CRM

Bookings

Meetings

Payments

Accounting

Subscriptions

Notifications

AI

Storage

Analytics

Settings

Administration

Audit
```

---

# Authentication APIs

Base

```
/api/v1/auth
```

| Method | Endpoint | Purpose |
|----------|----------|----------|
| POST | /login | Login |
| POST | /logout | Logout |
| POST | /refresh | Refresh Token |
| POST | /forgot-password | Reset Request |
| POST | /reset-password | Reset Password |
| POST | /verify-email | Verify Email |
| POST | /mfa/enable | Enable MFA |
| POST | /mfa/disable | Disable MFA |
| POST | /mfa/verify | Verify MFA |
| GET | /session | Current Session |

---

# Profile APIs

Base

```
/api/v1/profiles
```

| Method | Endpoint |
|----------|----------|
| GET | / |
| POST | / |
| GET | /{id} |
| PATCH | /{id} |
| DELETE | /{id} |

Additional

```
GET /me

PATCH /me

GET /me/preferences

PATCH /me/preferences
```

---

# Organization APIs

```
/api/v1/organizations
```

Endpoints

```
GET /

POST /

GET /{id}

PATCH /{id}

DELETE /{id}

GET /{id}/members

POST /{id}/members

PATCH /{id}/members/{memberId}

DELETE /{id}/members/{memberId}
```

---

# Lawyer APIs

```
/api/v1/lawyers
```

```
GET /

POST /

GET /{id}

PATCH /{id}

DELETE /{id}

GET /{id}/services

GET /{id}/availability

GET /{id}/reviews

GET /{id}/statistics
```

---

# Marketplace APIs

```
/api/v1/marketplace
```

```
GET /listings

POST /listings

PATCH /listings/{id}

DELETE /listings/{id}

GET /services

GET /practice-areas

GET /featured

GET /search
```

---

# Client APIs

```
/api/v1/clients
```

```
GET /

POST /

GET /{id}

PATCH /{id}

DELETE /{id}

GET /{id}/matters

GET /{id}/documents

GET /{id}/bookings
```

---

# CRM APIs

```
/api/v1/crm
```

Leads

```
GET /leads

POST /leads

PATCH /leads/{id}

DELETE /leads/{id}
```

Contacts

```
GET /contacts

POST /contacts

PATCH /contacts/{id}
```

Matters

```
GET /matters

POST /matters

PATCH /matters/{id}

GET /matters/{id}/timeline

GET /matters/{id}/notes

POST /matters/{id}/tasks
```

---

# Booking APIs

```
/api/v1/bookings
```

```
GET /

POST /

GET /{id}

PATCH /{id}

DELETE /{id}

POST /{id}/cancel

POST /{id}/confirm

POST /{id}/reschedule

GET /availability

GET /calendar
```

---

# Meeting APIs

```
/api/v1/meetings
```

```
GET /

POST /

GET /{id}

PATCH /{id}

POST /{id}/start

POST /{id}/end

POST /{id}/record

GET /{id}/participants

GET /{id}/transcript

GET /{id}/summary

GET /{id}/files
```

---

# Payment APIs

```
/api/v1/payments
```

```
POST /intent

POST /confirm

POST /refund

GET /transactions

GET /methods

POST /methods

DELETE /methods/{id}
```

Invoices

```
GET /invoices

POST /invoices

GET /invoices/{id}

PATCH /invoices/{id}

POST /invoices/{id}/send
```

---

# Accounting APIs

```
/api/v1/accounting
```

```
GET /ledger

GET /journal

GET /reports

GET /reports/profit-loss

GET /reports/balance-sheet

GET /reports/cash-flow
```

---

# Subscription APIs

```
/api/v1/subscriptions
```

```
GET /plans

POST /subscribe

PATCH /upgrade

PATCH /downgrade

DELETE /cancel

GET /usage

GET /features
```

---

# Notification APIs

```
/api/v1/notifications
```

```
GET /

PATCH /{id}/read

PATCH /read-all

DELETE /{id}

GET /preferences

PATCH /preferences
```

---

# AI APIs

```
/api/v1/ai
```

Conversation

```
POST /chat

GET /conversations

GET /conversations/{id}

DELETE /conversations/{id}
```

Documents

```
POST /documents/analyze

POST /documents/summarize

POST /documents/translate

POST /documents/classify
```

Legal

```
POST /legal/research

POST /legal/draft

POST /legal/review

POST /legal/questions
```

Agents

```
GET /agents

POST /agents

PATCH /agents/{id}

DELETE /agents/{id}
```

---

# Storage APIs

```
/api/v1/storage
```

Files

```
POST /upload

GET /files

GET /files/{id}

DELETE /files/{id}

PATCH /files/{id}
```

Folders

```
GET /folders

POST /folders

PATCH /folders/{id}

DELETE /folders/{id}
```

Sharing

```
POST /share

DELETE /share/{id}

POST /signed-url
```

---

# Analytics APIs

```
/api/v1/analytics
```

```
GET /dashboard

GET /revenue

GET /clients

GET /lawyers

GET /bookings

GET /ai

GET /usage

GET /reports
```

---

# Settings APIs

```
/api/v1/settings
```

```
GET /organization

PATCH /organization

GET /branding

PATCH /branding

GET /security

PATCH /security

GET /ai

PATCH /ai

GET /notifications

PATCH /notifications
```

---

# Audit APIs

```
/api/v1/audit
```

```
GET /events

GET /security

GET /access

GET /activity

GET /compliance

GET /exports
```

Read-only except for privileged administrative workflows.

---

# Administration APIs

```
/api/v1/admin
```

Users

```
GET /users

PATCH /users/{id}

DELETE /users/{id}

POST /users/{id}/suspend

POST /users/{id}/activate
```

Organizations

```
GET /organizations

PATCH /organizations/{id}
```

Platform

```
GET /metrics

GET /health

GET /jobs

POST /maintenance

POST /feature-flags
```

---

# Standard Query Parameters

Filtering

```
?status=confirmed

?organizationId=uuid

?lawyerId=uuid
```

Pagination

```
?page=1&pageSize=20
```

Cursor

```
?cursor=abc123
```

Sorting

```
?sort=createdAt

?order=desc
```

Search

```
?q=contract
```

Includes

```
?include=client,meeting
```

Fields

```
?fields=id,name,email
```

---

# Standard Headers

Authorization

```
Authorization: Bearer <JWT>
```

Idempotency

```
Idempotency-Key: <UUID>
```

Correlation

```
X-Correlation-ID: <UUID>
```

Organization

```
X-Organization-ID: <UUID>
```

---

# Permission Model

Each endpoint specifies:

- Required authentication
- Required organization membership
- Required role
- Required permission
- Ownership validation where applicable

Authorization is enforced before business logic executes.

---

# Long-Running Operations

Endpoints performing asynchronous work return:

```
202 Accepted
```

Response

```json
{
  "success": true,
  "jobId": "uuid",
  "status": "queued"
}
```

Examples:

- AI document analysis
- Transcript generation
- Large exports
- OCR
- Bulk imports

---

# Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address."
      }
    ]
  }
}
```

---

# Rate Limits

| Category | Default |
|-----------|---------|
| Anonymous | 60 req/min |
| Authenticated | 300 req/min |
| Enterprise | Configurable |
| AI Endpoints | Usage-based |
| File Uploads | Size and bandwidth limited |

---

# API Lifecycle

```
Design

↓

Implementation

↓

Unit Tests

↓

Integration Tests

↓

Contract Tests

↓

Security Tests

↓

Deployment

↓

Monitoring

↓

Deprecation
```

---

# OpenAPI Requirements

Every endpoint must include:

- Summary
- Description
- Tags
- Parameters
- Request schema
- Response schema
- Examples
- Error responses
- Security requirements

The OpenAPI 3.1 specification is the source of truth for generated SDKs and API documentation.

---

# Success Criteria

The REST API specification must:

✓ Provide a complete inventory of platform endpoints.

✓ Maintain consistent conventions across all domains.

✓ Enable secure and predictable integrations.

✓ Support web, mobile, AI agents, and third-party clients.

✓ Serve as the implementation contract for backend and frontend development.

This document is the authoritative REST API specification for the Barristrly platform.