# ⚖️ Barristrly API Architecture

> Version: 1.0
> Status: Approved
> Owner: Backend Engineering Team
> Depends On:
> - ERD.md
> - SYSTEM_ARCHITECTURE.md
> - TECH_STACK.md
> - AUTH_SCHEMA.md
> Last Updated: July 2026

---

# Purpose

This document defines the architectural standards for every API exposed by Barristrly.

It standardizes:

- REST API Design
- Authentication
- Authorization
- Versioning
- Request & Response Formats
- Error Handling
- Pagination
- Filtering
- Sorting
- Rate Limiting
- File Uploads
- Idempotency
- API Security
- Real-time Communication
- API Gateway
- Service Boundaries

Every backend service must follow this specification.

---

# High-Level API Architecture

```
                    Clients
     ┌──────────────┼────────────────┐
     ▼              ▼                ▼
   Web App      Mobile App      AI Agents
                     │
                     ▼
              API Gateway (HTTPS)
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 Authentication   REST APIs    Realtime Gateway
      │              │              │
      └──────────────┼──────────────┘
                     ▼
             Business Services
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 CRM Service   Booking Service  AI Service
      ▼              ▼              ▼
          PostgreSQL + Storage
```

---

# API Design Principles

Every API must be:

- RESTful
- Stateless
- Versioned
- Secure
- Predictable
- Idempotent where applicable
- Observable
- Backward Compatible

---

# Base URL

Production

```
https://api.barristrly.com
```

Development

```
http://localhost:3000
```

---

# API Versioning

All APIs are versioned.

```
/api/v1/
```

Examples

```
GET /api/v1/lawyers

GET /api/v1/bookings

POST /api/v1/payments
```

Breaking changes require a new version.

---

# Resource Naming

Use plural nouns.

Correct

```
/lawyers

/bookings

/payments

/meetings
```

Avoid

```
/getLawyer

/createBooking

/deleteInvoice
```

Actions belong to HTTP methods.

---

# HTTP Methods

| Method | Purpose |
|----------|----------|
| GET | Retrieve |
| POST | Create |
| PUT | Replace |
| PATCH | Partial Update |
| DELETE | Soft Delete |

Example

```
GET /clients

POST /clients

PATCH /clients/{id}

DELETE /clients/{id}
```

---

# URL Structure

```
/api/v1/resource/{id}

/api/v1/resource/{id}/children
```

Example

```
/api/v1/bookings

/api/v1/bookings/{id}

/api/v1/bookings/{id}/participants

/api/v1/lawyers/{id}/reviews
```

---

# Authentication

Primary Authentication

Supabase JWT

```
Authorization

Bearer JWT_TOKEN
```

No session cookies for API authentication.

---

# Authorization

Authorization uses RBAC.

```
User

↓

Organization

↓

Role

↓

Permission

↓

API Access
```

Every request passes through:

1. Authentication
2. Organization Resolution
3. Role Validation
4. Permission Check
5. Business Rules

---

# Request Format

```
POST /clients

Content-Type

application/json
```

Example

```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "+971..."
}
```

Use camelCase in JSON payloads.

Database remains snake_case.

---

# Response Format

Successful response

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "links": {}
}
```

Never return raw arrays.

---

# Error Response

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "Selected time slot is unavailable.",
    "details": []
  }
}
```

---

# Standard HTTP Status Codes

| Code | Meaning |
|-------|----------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Internal Error |

---

# Validation

Validate:

- Required fields
- Types
- Enums
- Foreign Keys
- Business Rules

Return all validation errors together.

---

# Pagination

Offset pagination

```
?page=1

&pageSize=20
```

Response

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 245,
    "totalPages": 13
  }
}
```

Cursor pagination should be preferred for high-volume endpoints such as audit events, notifications, analytics, and activity feeds.

---

# Filtering

Examples

```
?status=confirmed

?lawyerId=uuid

?organizationId=uuid

?from=2026-07-01

?to=2026-07-31
```

Multiple filters may be combined.

---

# Sorting

```
?sort=createdAt

?order=desc
```

Support multiple sort fields where practical.

---

# Searching

```
?q=contract
```

Use full-text search where supported.

---

# Sparse Field Selection

```
?fields=id,name,email
```

Reduces payload size.

---

# Includes

```
?include=lawyer,reviews
```

Example

```
GET

/bookings/{id}?include=meeting,payment
```

Avoid deeply nested includes.

---

# Idempotency

Required for:

- Payments
- Subscription Changes
- Invoice Generation

Header

```
Idempotency-Key:
```

Duplicate requests with the same key return the original result instead of executing twice.

---

# Rate Limiting

Example defaults

Anonymous

```
60 requests/minute
```

Authenticated

```
300 requests/minute
```

Enterprise

Configurable.

Headers

```
X-RateLimit-Limit

X-RateLimit-Remaining

Retry-After
```

---

# File Uploads

Use multipart/form-data.

```
POST

/files
```

Upload flow

```
Client

↓

Signed Upload URL

↓

Object Storage

↓

Metadata API

↓

Background Processing
```

Large uploads should bypass the API server and upload directly to object storage using signed URLs.

---

# API Gateway Responsibilities

The API Gateway handles:

- JWT validation
- Rate limiting
- Request logging
- Correlation IDs
- CORS
- API version routing
- Compression
- Security headers

Business logic must remain inside domain services.

---

# Correlation IDs

Every request receives a unique identifier.

Header

```
X-Correlation-ID
```

Used by:

- Logs
- Audit
- Analytics
- Background Jobs
- AI
- Notifications

---

# Security Headers

Include

- HSTS
- CSP
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

---

# CORS Policy

Allow only approved origins.

Example

```
app.barristrly.com

admin.barristrly.com
```

Avoid wildcard origins in production.

---

# API Observability

Every request records:

- Request ID
- Correlation ID
- Latency
- Status Code
- User
- Organization
- Endpoint
- Response Size

Metrics should feed the Analytics and Audit domains.

---

# Service Boundaries

```
Authentication

↓

Identity

↓

Marketplace

↓

CRM

↓

Bookings

↓

Meetings

↓

Payments

↓

Accounting

↓

AI

↓

Notifications
```

Services communicate through APIs or events—not direct database access across bounded contexts.

---

# Long-Running Operations

Operations such as AI document analysis, transcript generation, and large exports should return:

```
202 Accepted
```

with a job identifier.

Clients poll the job endpoint or subscribe to realtime updates.

---

# API Deprecation Policy

- New endpoints are added before old ones are removed.
- Deprecated endpoints remain supported for a defined transition period.
- Deprecation notices are included in documentation and response headers where appropriate.

---

# API Documentation

Every endpoint must include:

- Description
- Authentication requirements
- Permissions
- Path parameters
- Query parameters
- Request schema
- Response schema
- Error responses
- Rate limits
- Example requests
- Example responses

OpenAPI 3.1 should be the canonical machine-readable specification.

---

# Testing Standards

Every endpoint must have:

- Unit tests
- Integration tests
- Authorization tests
- Validation tests
- Performance tests
- Security tests
- Contract tests

---

# Success Criteria

The API architecture must:

✓ Provide a consistent developer experience across every service.

✓ Support secure, scalable, and versioned communication.

✓ Maintain strict separation between gateway, business logic, and persistence.

✓ Enable high-performance integrations for web, mobile, AI agents, and third-party systems.

✓ Support future microservice decomposition without breaking client applications.

This document is the authoritative API architecture standard for the Barristrly platform.