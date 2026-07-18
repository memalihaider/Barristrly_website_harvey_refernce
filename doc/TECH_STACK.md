# ⚖️ Barristrly Technology Stack

> Version: 1.0
> Status: Approved
> Owner: Engineering Team
> Last Updated: July 2026

---

# Purpose

This document defines the official technology stack for Barristrly.

Its purpose is to ensure:

- Consistency across the codebase
- Long-term maintainability
- AI-assisted development compatibility
- High performance
- Enterprise-grade security
- Scalability

No technology should be introduced into the project unless it is documented here or approved through an Architecture Decision Record (ADR).

---

# Engineering Philosophy

Technology choices prioritize:

- Developer productivity
- Type safety
- Performance
- Scalability
- Open standards
- Strong ecosystem support
- Long-term maintainability
- AI-assisted development compatibility

---

# Technology Selection Principles

Every technology must satisfy the following criteria:

- Production-proven
- Actively maintained
- Strong community support
- Excellent documentation
- TypeScript compatibility (where applicable)
- Cloud-native architecture
- Enterprise scalability

---

# High-Level Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js |
| Mobile | React Native + Expo |
| Language | TypeScript |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Cache | Redis |
| AI | Google Gemini |
| Local AI | Ollama |
| Speech-to-Text | Whisper |
| Text-to-Speech | Piper |
| Meetings | mediasoup |
| Payments | Stripe |
| Email | Resend |
| CDN | Cloudflare |
| Hosting | VPS + Docker |
| CI/CD | GitHub Actions |

---

# Frontend

## Framework

Next.js

Reason

- Server Components
- App Router
- Excellent SEO
- Strong ecosystem
- Performance
- React compatibility

---

## UI Library

shadcn/ui

Reason

- Accessible
- Customizable
- No runtime dependency
- Tailwind-native
- Production-ready

---

## Styling

Tailwind CSS

Reason

- Utility-first
- Fast development
- Design token support
- Responsive by default

---

## Icons

Lucide React

Reason

- Lightweight
- Consistent
- Tree-shakeable

---

## Forms

React Hook Form

Validation

Zod

Reason

- High performance
- Excellent TypeScript support
- Minimal re-renders

---

## Tables

TanStack Table

Reason

- Enterprise-grade
- Flexible
- High performance

---

## Charts

Recharts

Future

Apache ECharts (advanced analytics)

---

## State Management

Global

Zustand

Server State

TanStack Query

Reason

- Simplicity
- Performance
- Excellent caching

---

# Mobile

Framework

React Native

Runtime

Expo

Navigation

Expo Router

Storage

MMKV

Reason

Shared TypeScript codebase with web while maintaining native capabilities.

---

# Backend

Platform

Supabase

Components

- PostgreSQL
- Edge Functions
- Realtime
- Storage
- Authentication

Reason

Rapid development with enterprise-grade features.

---

# Database

Engine

PostgreSQL

Reason

- ACID compliance
- Advanced indexing
- JSON support
- Full-text search
- Reliability

---

# ORM

Preferred

Drizzle ORM

Alternative

Supabase Client (simple operations)

Reason

Type safety, migrations, maintainability.

---

# Authentication

Supabase Auth

Capabilities

- Email/password
- Magic links
- OAuth (future)
- MFA
- Session management
- JWT

---

# Storage

Supabase Storage

Purpose

- Profile images
- Legal documents
- Meeting files
- Attachments

---

# AI Stack

## Primary LLM

Google Gemini 2.5 Flash

Purpose

- Chat
- Reasoning
- Summarization
- Intent detection
- Recommendations

---

## Local Models

Ollama

Purpose

- Offline inference
- Privacy-sensitive tasks
- Cost optimization
- Experimental models

---

## Model Routing

All AI requests must pass through a centralized AI Service.

The application must never communicate directly with model providers.

Benefits

- Provider flexibility
- Cost optimization
- Monitoring
- Prompt management
- Failover support

---

# Speech AI

Speech-to-Text

Whisper

Purpose

Meeting transcription

Voice intake

Audio uploads

---

Text-to-Speech

Piper

Purpose

AI voice responses

Accessibility

Voice assistant

---

# Search

Version 1

PostgreSQL Full-Text Search

Future

OpenSearch / Elasticsearch

---

# Meetings

Technology

mediasoup

Supporting Services

Coturn

WebRTC

Purpose

- Secure video consultations
- Screen sharing
- Audio calls
- Live transcription

---

# Payments

Provider

Stripe

Capabilities

- Subscriptions
- One-time payments
- Refunds
- Invoices
- Webhooks

---

# Notifications

Email

Resend

Push

Firebase Cloud Messaging

SMS

Twilio (Future)

WhatsApp

Meta WhatsApp Cloud API

---

# Background Jobs

Preferred

Supabase Scheduled Functions

Future

BullMQ + Redis

---

# API

Style

REST

Future

GraphQL (selected use cases)

Documentation

OpenAPI 3.1

---

# Caching

Technology

Redis

Use Cases

- Sessions
- AI responses
- Search
- Rate limiting
- Frequently accessed data

---

# Security

Authentication

Supabase Auth

Authorization

Role-Based Access Control (RBAC)

Database

Row-Level Security (RLS)

Encryption

TLS in transit

AES-256 at rest

Secrets

Environment variables

Secret manager (future)

---

# Monitoring

Error Tracking

Sentry

Metrics

Prometheus (future)

Visualization

Grafana (future)

Logging

Structured JSON logs

---

# Testing

Unit Testing

Vitest

Component Testing

React Testing Library

E2E

Playwright

API Testing

Postman / Bruno

Performance

Lighthouse

Accessibility

axe-core

---

# Development Tools

Package Manager

pnpm

Monorepo

Turborepo

Version Control

Git

Repository

GitHub

IDE

Cursor

Supported AI Tools

- Gemini CLI
- Claude Code
- OpenAI Codex
- GitHub Copilot

---

# DevOps

Containerization

Docker

Reverse Proxy

Nginx

CDN

Cloudflare

Hosting

Linux VPS

Future

Kubernetes

---

# CI/CD

GitHub Actions

Pipeline

1. Install dependencies
2. Lint
3. Type check
4. Unit tests
5. Build
6. E2E tests
7. Deploy to staging
8. Manual approval
9. Deploy to production

---

# Version Policy

Node.js

LTS only

TypeScript

Latest stable

React

Latest stable

Next.js

Latest stable App Router

Dependencies

Updated monthly

Security patches applied immediately

---

# Approved Libraries

UI

- shadcn/ui
- Radix UI
- Lucide

Validation

- Zod

Utilities

- date-fns
- clsx
- class-variance-authority

Forms

- React Hook Form

Networking

- Axios (only where fetch is insufficient)

---

# Prohibited Technologies

The following technologies must not be introduced without architectural approval:

- JavaScript-only modules where TypeScript alternatives exist
- jQuery
- Bootstrap
- Redux Toolkit (unless justified)
- Multiple CSS frameworks
- Multiple state management libraries
- Multiple ORMs
- Direct AI provider SDK usage in feature modules

---

# Architecture Decision Process

Any change to the approved technology stack requires:

1. Technical proposal
2. Trade-off analysis
3. Architecture review
4. ADR approval
5. Documentation update

---

# Success Criteria

The technology stack must:

- Remain consistent across all modules
- Support AI-assisted development
- Scale to enterprise workloads
- Maintain strong type safety
- Minimize operational complexity
- Enable rapid feature delivery
- Be maintainable by small and large engineering teams