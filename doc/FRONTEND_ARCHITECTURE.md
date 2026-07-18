# ⚖️ Barristrly Frontend Architecture

> Version: 1.0
> Status: Approved
> Owner: Frontend Engineering
> Depends On:
> - DESIGN_SYSTEM.md
> - API_ARCHITECTURE.md
> - AUTH_SCHEMA.md
> - SECURITY_ARCHITECTURE.md
> Last Updated: July 2026

---

# Purpose

This document defines the complete frontend architecture for Barristrly.

The UI philosophy is inspired by modern enterprise AI software:

- Minimal
- Fast
- Workspace-first
- AI-first
- Content-focused
- Enterprise-grade

The goal is **not** to copy another product, but to create a cleaner, faster experience optimized for legal professionals.

---

# Design Principles

Every screen should follow these principles:

✓ Minimal Interface

✓ Maximum Workspace

✓ AI First

✓ Keyboard First

✓ Mobile Responsive

✓ Accessible

✓ Consistent

✓ Fast

---

# Product Philosophy

Barristrly is not a traditional legal ERP.

It is an AI Workspace.

Everything starts from one intelligent workspace.

```
User

↓

Workspace

↓

Matter

↓

AI

↓

Result
```

---

# UI Inspiration

Desired characteristics:

- Large whitespace
- Minimal borders
- Flat surfaces
- Clear typography
- Subtle animations
- Fast interactions
- Simple navigation
- Progressive disclosure
- Command-first workflow

Avoid:

- Heavy gradients
- Overcrowded dashboards
- Excessive cards
- Nested menus
- Dense tables by default

---

# Technology Stack

Framework

```
Next.js (App Router)
```

Language

```
TypeScript
```

Styling

```
Tailwind CSS
```

Components

```
shadcn/ui
```

Icons

```
Lucide Icons
```

Animations

```
Framer Motion
```

Forms

```
React Hook Form

+

Zod
```

Tables

```
TanStack Table
```

Data Fetching

```
TanStack Query
```

Charts

```
Recharts
```

---

# Folder Structure

```
app/

components/

features/

hooks/

lib/

providers/

styles/

types/

utils/

services/
```

---

# Feature Structure

Example

```
features/

booking/

crm/

marketplace/

meetings/

payments/

documents/

ai/

analytics/
```

Each feature owns:

- Pages
- Components
- Hooks
- API
- Types
- Validation

---

# Layout Structure

Every authenticated screen follows:

```
┌───────────────────────────────┐
│ Top Navigation                │
├───────┬───────────────────────┤
│       │                       │
│ Left  │ Main Workspace        │
│ Nav   │                       │
│       │                       │
├───────┴───────────────────────┤
│ AI Command Bar (Optional)     │
└───────────────────────────────┘
```

---

# Primary Navigation

The left sidebar contains only core areas.

```
Home

Assistant

Marketplace

Matters

Clients

Calendar

Meetings

Documents

Payments

Analytics

Settings
```

Collapse supported.

Pinned favorites supported.

Keyboard navigation supported.

---

# Top Navigation

Contains:

- Global Search
- AI Command
- Notifications
- Organization Switcher
- Profile
- Theme Switch

No secondary navigation unless required.

---

# Homepage Philosophy

The homepage is not a dashboard full of widgets.

Instead it is a legal workspace.

Structure

```
Greeting

↓

Universal AI Prompt

↓

Quick Actions

↓

Recent Matters

↓

Recent Documents

↓

Upcoming Meetings

↓

Pinned Workspaces
```

---

# Universal AI Workspace

Largest component.

```
Ask Barristrly AI

──────────────────────

Upload Files

Select Matter

Choose Jurisdiction

Choose AI Agent

Run
```

Every workflow starts here.

---

# Quick Actions

Examples

- Review Contract
- Draft Agreement
- Summarize Case
- Analyze Evidence
- Prepare Invoice
- Schedule Meeting
- Create Matter

---

# Workspace Cards

Minimal.

Each card shows:

- Status
- Last updated
- Owner
- Progress
- AI actions

No unnecessary metrics.

---

# Matter Workspace

Every legal matter has its own workspace.

Sections

Overview

Timeline

Documents

Meetings

Tasks

AI

Invoices

Notes

Activity

Everything stays inside one workspace.

---

# AI Panel

Right side panel.

Capabilities

- Chat
- Explain
- Draft
- Translate
- Compare
- Summarize
- Cite
- Research

Persistent across pages.

---

# Global Search

Supports

- Matters
- Clients
- Lawyers
- Documents
- Meetings
- AI Conversations
- Invoices

Keyboard shortcut

```
⌘ K

Ctrl + K
```

---

# Command Palette

Examples

```
Create Matter

Assign Lawyer

Open Calendar

Search Client

Generate Invoice

Review Contract
```

Everything should be executable without touching navigation.

---

# Data Fetching

Use:

Server Components

for

- initial rendering
- SEO
- static content

Use:

Client Components

for

- forms
- chat
- live updates
- filters
- drag-and-drop

---

# State Management

Server State

```
TanStack Query
```

UI State

```
React Context
```

Form State

```
React Hook Form
```

Avoid global state unless necessary.

---

# Error Handling

Every route includes:

- Error Boundary
- Loading UI
- Empty State
- Retry Action

Never expose raw errors.

---

# Forms

Requirements

- Inline validation
- Autosave where appropriate
- Keyboard friendly
- Accessible labels
- Clear error messages

---

# Tables

Use TanStack Table.

Capabilities

- Sorting
- Filtering
- Search
- Pagination
- Column visibility
- Saved views
- Export

---

# Accessibility

Target

WCAG 2.2 AA

Support:

- Keyboard navigation
- Screen readers
- Focus indicators
- High contrast
- Reduced motion

---

# Performance

Goals

- Initial load < 2 seconds on broadband
- Route transitions < 300 ms where cached
- Lazy-load large modules
- Optimize images and fonts
- Stream server-rendered content where appropriate

---

# Responsive Design

Breakpoints

Desktop

Tablet

Mobile

Mobile uses:

- Bottom navigation
- Drawer menu
- Simplified layouts

Core workflows remain fully functional.

---

# Theme

Support:

Light

Dark

System

Persist preference.

---

# Security

Frontend responsibilities

- Secure cookie usage
- CSRF protection where applicable
- XSS-safe rendering
- Permission-aware UI
- No sensitive data in local storage
- Graceful session expiry handling

---

# Future Enhancements

- Multi-window workspace
- Split-screen document review
- AI voice interaction
- Offline document drafts
- Real-time collaborative editing
- Custom workspace layouts
- Plugin marketplace

---

# Success Criteria

The Frontend Architecture must:

✓ Feel clean and uncluttered.

✓ Prioritize legal work over dashboards.

✓ Make AI the primary interaction model.

✓ Keep navigation simple and predictable.

✓ Scale from solo lawyers to enterprise legal teams.

✓ Maintain a unique Barristrly identity while following modern enterprise UX principles.

This document is the authoritative frontend architecture specification for the Barristrly platform.