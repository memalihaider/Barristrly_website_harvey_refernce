# ⚖️ Barristrly Coding Standards

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Last Updated: July 2026

---

# Purpose

This document defines the engineering standards for Barristrly.

Its purpose is to ensure:

- Consistent code quality
- Maintainable architecture
- Predictable project structure
- AI-assisted development compatibility
- Enterprise-grade scalability
- Security by default

Every contributor, whether human or AI, must follow these standards.

---

# Engineering Principles

Every line of code must prioritize:

- Readability over cleverness
- Simplicity over complexity
- Composition over inheritance
- Reusability over duplication
- Explicitness over magic
- Type safety over convenience
- Security over speed
- Maintainability over shortcuts

---

# Architecture Principles

The application must follow:

- Feature-first architecture
- Modular architecture
- API-first design
- Domain-driven organization
- Server-first rendering where appropriate
- Stateless services
- Separation of concerns

Never mix business logic with UI components.

---

# Repository Structure

/apps
/web
/mobile

/packages
/ui
/types
/config
/utils

doc/

/supabase

/scripts

/tests

---

# Feature Structure

Every feature must follow the same layout.

feature-name/

components/

hooks/

services/

schemas/

types/

utils/

constants/

actions/

queries/

mutations/

validators/

tests/

index.ts

No feature may access another feature's internal implementation directly.

---

# Naming Conventions

Folders

✅ kebab-case

```
client-profile
meeting-room
subscription-plan
```

Files

✅ kebab-case

```
booking-calendar.tsx
client-card.tsx
```

React Components

✅ PascalCase

```
ClientCard
MeetingRoom
DashboardLayout
```

Hooks

```
useBooking()

useClient()

useMeeting()
```

Utilities

camelCase

```
formatDate()

calculateTax()

generateInvoice()
```

Constants

UPPER_SNAKE_CASE

```
MAX_UPLOAD_SIZE

DEFAULT_LANGUAGE
```

Types

PascalCase

```
Client

Lawyer

Meeting
```

Enums

PascalCase

```
UserRole

MeetingStatus
```

Interfaces

Never prefix with "I"

Correct

```
User

Meeting

Invoice
```

Wrong

```
IUser

IMeeting
```

---

# TypeScript Standards

TypeScript Strict Mode is mandatory.

Never use

```
any
```

Prefer

```
unknown

generics

union types

discriminated unions
```

Every function must define explicit return types.

Bad

```ts
function createUser() {

}
```

Good

```ts
function createUser(): Promise<User> {

}
```

---

# React Standards

Prefer

Server Components

Use Client Components only when necessary.

Never fetch server data inside deeply nested client components.

Components should be:

Small

Focused

Reusable

Composable

---

# Component Rules

A component should ideally do one thing.

Maximum responsibilities:

- render UI
- receive props
- emit events

Business logic belongs elsewhere.

---

# State Management

Use:

Server State

TanStack Query

Client State

Zustand

Never duplicate the same state.

Avoid prop drilling.

---

# Forms

Every form must use

React Hook Form

+

Zod

Validation happens:

Client

↓

Server

↓

Database

Never trust client validation alone.

---

# API Standards

Every endpoint must:

Validate input

Authenticate user

Authorize action

Execute business logic

Return standardized response

Log critical events

---

# Standard API Response

Success

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": ""
  }
}
```

---

# Database Standards

Never expose raw SQL in UI.

Never bypass Row-Level Security.

Always use transactions for critical operations.

Always create indexes for:

Foreign keys

Search columns

Frequently filtered fields

---

# Error Handling

Never swallow exceptions.

Always log unexpected failures.

Display user-friendly messages.

Never expose stack traces.

---

# Logging

Log:

Authentication

Payments

AI Requests

Meetings

Subscriptions

Permission Changes

Never log:

Passwords

Tokens

Private keys

Sensitive personal information

---

# Security Rules

Every request must:

Authenticate

↓

Authorize

↓

Validate

↓

Execute

↓

Audit

↓

Respond

Never skip authorization.

---

# Environment Variables

Never hardcode:

API Keys

Passwords

Secrets

Tokens

URLs

Everything configurable belongs in environment variables.

---

# Performance

Lazy-load large components.

Paginate large datasets.

Virtualize long lists.

Cache expensive operations.

Avoid unnecessary re-renders.

---

# Accessibility

Every interactive element must:

Be keyboard accessible.

Have visible focus states.

Provide accessible labels.

Meet WCAG 2.2 AA.

---

# AI Development Rules

AI assistants may:

Generate boilerplate.

Write tests.

Suggest refactoring.

Generate documentation.

AI assistants must not:

Invent business rules.

Change database schemas without approval.

Modify authentication logic.

Bypass validation.

Ignore architecture.

Every AI-generated change must be reviewed before merging.

---

# Git Workflow

Main

Production-ready code only.

Develop

Integration branch.

Feature Branch

```
feature/booking-calendar

feature/client-dashboard

feature/stripe-webhooks
```

Bug Fix

```
fix/login-timeout
```

Hotfix

```
hotfix/payment-failure
```

---

# Commit Convention

Use Conventional Commits.

Examples:

```
feat(auth): add MFA support

fix(crm): resolve duplicate contacts

docs(api): update authentication flow

refactor(ai): simplify prompt builder

test(meeting): add WebRTC integration tests
```

---

# Pull Request Rules

Every PR must include:

Purpose

Screenshots (if UI)

Testing evidence

Breaking changes

Migration notes

Checklist

---

# Code Review Checklist

Reviewers must verify:

✓ Type safety

✓ Naming consistency

✓ Business logic correctness

✓ Security

✓ Performance

✓ Accessibility

✓ Error handling

✓ Test coverage

✓ Documentation updates

---

# Testing Standards

Minimum coverage:

Business logic: 90%

Utilities: 95%

Critical services: 95%

All bugs must receive regression tests before closure.

---

# Documentation Requirements

Every feature must include:

Purpose

Architecture

Business rules

API references

Examples

Known limitations

Future enhancements

---

# Definition of Done

A feature is complete only when:

✓ Requirements implemented

✓ Type-safe

✓ Responsive

✓ Accessible

✓ Unit tested

✓ Integration tested

✓ Documentation updated

✓ Code reviewed

✓ Approved

✓ Deployed to staging

---

# Anti-Patterns

Never:

❌ Use `any`

❌ Duplicate business logic

❌ Mix UI and business logic

❌ Hardcode configuration

❌ Bypass authentication

❌ Ignore error handling

❌ Skip validation

❌ Commit commented-out code

❌ Leave TODOs in production

❌ Create circular dependencies

---

# Success Criteria

The codebase should:

- Feel like it was written by one team.
- Be understandable without external explanation.
- Be easy for AI assistants to extend.
- Remain maintainable for years.
- Scale without major architectural rewrites.
- Support rapid, high-quality feature delivery.