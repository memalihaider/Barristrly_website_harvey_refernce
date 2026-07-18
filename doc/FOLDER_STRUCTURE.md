# ⚖️ Barristrly Folder Structure

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Last Updated: July 2026

---

# Purpose

This document defines the official repository structure for Barristrly.

Goals:

- Consistent organization
- Clear ownership
- Maximum code reuse
- AI-friendly architecture
- Enterprise scalability
- Fast onboarding

Every file in the repository must belong to one clearly defined location.

---

# Monorepo Overview

Barristrly uses:

- pnpm Workspaces
- Turborepo
- TypeScript
- Feature-First Architecture

```

Barristrly/
│
├── apps/
├── packages/
├── tooling/
├── docs/
├── infrastructure/
├── scripts/
├── .github/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md

```

---

# Root Directory

```

/
README.md
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.json
eslint.config.js
prettier.config.js
.gitignore
.env.example

```

Only repository-level configuration belongs here.

Never place business code in the repository root.

---

# Apps

Applications are independently deployable.

```

apps/

```

Contains

```

apps/
web/
mobile/
admin/
landing/

```

---

# apps/web

Primary SaaS application.

Contains

- Client Portal
- Lawyer Portal
- Mediator Portal

```

web/

src/
app/
features/
components/
providers/
hooks/
lib/
styles/
assets/

```

---

# apps/mobile

React Native application.

```

mobile/

app/
components/
features/
hooks/
navigation/
assets/

```

---

# apps/admin

Optional standalone administration interface.

Contains

- Platform Management
- Analytics
- User Moderation
- System Configuration

---

# apps/landing

Marketing website.

Contains

- Landing Pages
- Pricing
- Documentation
- Blog
- SEO

No business logic.

---

# Packages

Reusable libraries shared by applications.

```

packages/

```

---

# packages/ui

Shared design system.

```

ui/

components/
layouts/
icons/
hooks/
styles/
tokens/

```

Contains

- Buttons
- Inputs
- Tables
- Dialogs
- Cards
- Navigation

No business logic.

---

# packages/database

Database layer.

```

database/

schema/
migrations/
queries/
seed/
types/

```

Contains

- Drizzle schema
- SQL migrations
- Database utilities
- Shared database types

---

# packages/api

Shared API client.

Contains

- API wrappers
- HTTP utilities
- Request helpers
- Response types

---

# packages/auth

Authentication library.

Contains

- Session helpers
- Permission checks
- Authentication hooks
- Role utilities

---

# packages/ai

Shared AI platform.

```

ai/

providers/
prompts/
agents/
memory/
embeddings/
router/
evaluation/
utils/

```

Contains

- Model routing
- Prompt builders
- AI providers
- Agent orchestration

No feature-specific prompts.

---

# packages/config

Shared configuration.

```

config/

eslint/
prettier/
typescript/
tailwind/

```

---

# packages/types

Global TypeScript definitions.

Contains

- Shared interfaces
- Enums
- DTOs
- API types

Never duplicate types across applications.

---

# packages/utils

Reusable utilities.

Contains

- Date helpers
- String helpers
- Validation
- Formatting
- Calculations

Utilities must be pure functions.

---

# packages/constants

Application-wide constants.

Examples

```

USER_ROLES

PAYMENT_STATUS

SUPPORTED_LANGUAGES

```

---

# packages/hooks

Reusable React hooks.

Examples

```

useTheme()

useMediaQuery()

useDebounce()

```

Business-specific hooks belong inside features.

---

# packages/testing

Shared testing utilities.

Contains

- Mock factories
- Test helpers
- Render utilities
- Fixtures

---

# Documentation

```

docs/

```

Structure

```

01_Foundation/
02_Product/
03_Design/
04_Database/
05_API/
06_AI/
07_Engineering/
08_DevOps/
09_Testing/
10_Legal/

```

Documentation is version controlled.

Every architecture change must update relevant documentation.

---

# Infrastructure

```

infrastructure/

```

Contains

```

docker/

nginx/

cloudflare/

terraform/

monitoring/

```

No application code.

---

# Scripts

```

scripts/

```

Contains

- Database scripts
- Build scripts
- Code generators
- Maintenance scripts

Scripts must be idempotent.

---

# GitHub

```

.github/

```

Contains

- CI
- Issue templates
- Pull Request templates
- Workflows

---

# Feature Architecture

Every feature follows the same structure.

```

feature-name/

components/
hooks/
services/
actions/
queries/
mutations/
validators/
schemas/
types/
constants/
utils/
tests/
index.ts

```

---

# Import Rules

Applications

↓

Packages

↓

Utilities

Allowed

```

apps/web

↓

packages/ui

↓

packages/utils

```

Forbidden

```

packages/ui

↓

apps/web

```

Packages must never depend on applications.

---

# Dependency Direction

```

Apps
↓

Feature Modules
↓

Shared Packages
↓

Utilities

```

Dependencies flow downward only.

Circular dependencies are prohibited.

---

# Barrel Exports

Every package must expose a single public API.

Example

```

packages/ui/index.ts

```

Never import internal implementation files directly.

Correct

```ts
import { Button } from "@repo/ui";
```

Wrong

```ts
import Button from "@repo/ui/components/button/button";
```

---

# Assets

Application assets

```

assets/

images/

icons/

fonts/

animations/

```

Shared assets belong in packages.

---

# Environment Files

```

.env.example

.env.local

.env.development

.env.production

```

Never commit secrets.

---

# Generated Files

Generated code belongs inside

```

generated/

```

Examples

- OpenAPI clients
- Database types
- AI schemas

Never edit generated files manually.

---

# Tests

```

tests/

unit/

integration/

e2e/

fixtures/

```

Every feature owns its own tests.

Shared test helpers belong in `packages/testing`.

---

# File Naming

Folders

kebab-case

Files

kebab-case

Components

PascalCase

Hooks

camelCase prefixed with use

---

# Maximum File Size

Recommended

- Components: ≤300 lines
- Hooks: ≤200 lines
- Services: ≤400 lines
- Utilities: ≤150 lines

Split files that become difficult to understand.

---

# Module Ownership

Each feature owns:

- Components
- Services
- Types
- Validation
- Business rules
- Tests

Avoid shared mutable state across features.

---

# Architecture Rules

Must:

- Keep business logic inside feature services
- Keep UI components presentational
- Use shared packages for reusable code
- Document new packages before adding them

Must Not:

- Import between feature internals
- Duplicate shared utilities
- Mix business logic with UI
- Store secrets in source code
- Create circular dependencies

---

# Repository Growth Strategy

As Barristrly grows:

- New applications belong in `apps/`
- Shared functionality belongs in `packages/`
- Infrastructure belongs in `infrastructure/`
- Documentation belongs in `docs/`

The repository structure should remain stable as the engineering team scales from one developer to many.

---

# Success Criteria

A developer or AI assistant should be able to:

✓ Locate any feature within seconds

✓ Understand package responsibilities

✓ Reuse shared functionality confidently

✓ Add new modules without restructuring the repository

✓ Scale the platform without introducing architectural inconsistency

This folder structure is the canonical layout for the Barristrly monorepo and must be followed unless superseded by an approved Architecture Decision Record (ADR).