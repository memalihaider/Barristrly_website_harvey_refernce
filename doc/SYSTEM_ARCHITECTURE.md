# ⚖️ Barristrly System Architecture

> Version: 1.0
> Status: Living Document
> Owner: Engineering
> Last Updated: July 2026

---

# Purpose

This document defines the complete technical architecture of Barristrly.

It establishes:

- Overall system architecture
- Service boundaries
- Data flow
- AI architecture
- Integration strategy
- Deployment model
- Scalability approach
- Communication between services

This document does **not** define database schemas or API contracts. Those are maintained separately.

---

# Architecture Principles

Barristrly is built using the following principles.

## API First

Every feature must expose well-defined APIs.

No frontend should communicate directly with another frontend.

---

## AI First

Artificial Intelligence is a platform capability rather than a standalone feature.

Every module should be capable of consuming AI services through standardized interfaces.

---

## Modular Architecture

Every business capability must be isolated.

Examples:

Authentication

CRM

Booking

Accounting

Marketplace

Meetings

Notifications

AI

Payments

Each module owns its own business logic.

---

## Scalable by Design

Every service must be horizontally scalable.

Stateless services should be preferred.

---

## Secure by Default

Every request must be authenticated.

Every resource must be authorized.

Every action should be auditable.

---

# High-Level Architecture

                     Users
                        │
        ┌───────────────┼───────────────┐
        │               │               │
     Web App       Mobile Apps      Admin Portal
        │               │               │
        └───────────────┼───────────────┘
                        │
                API Gateway / BFF
                        │
──────────────────────────────────────────────────
 Authentication Service
 User Service
 Marketplace Service
 Lawyer Service
 Booking Service
 Meeting Service
 CRM Service
 Accounting Service
 Subscription Service
 Notification Service
 Analytics Service
 AI Service
──────────────────────────────────────────────────
                        │
                  PostgreSQL
                        │
        Redis     Object Storage     Search Index
                        │
        Gemini AI • Whisper • Piper • Stripe
                        │
                   External Services

---

# Client Applications

## Web Application

Technology

- Next.js
- React
- TypeScript

Responsibilities

- Client portal
- Lawyer portal
- Admin dashboard
- Mediator dashboard

---

## Mobile Applications

Technology

- React Native
- Expo

Responsibilities

- Mobile booking
- AI Chat
- Notifications
- Meetings
- Profile management

---

# Backend

Technology

- Supabase
- PostgreSQL
- Edge Functions
- TypeScript

Responsibilities

- Business logic
- Authentication
- Authorization
- Validation
- Integrations
- API orchestration

---

# Core Services

## Authentication Service

Responsibilities

- Registration
- Login
- Password reset
- Sessions
- MFA
- Role management

Dependencies

- Supabase Auth

---

## User Service

Responsibilities

- User profiles
- Lawyer verification
- Documents
- Permissions
- Preferences

---

## Marketplace Service

Responsibilities

- Categories
- Search
- Discovery
- Featured lawyers
- Ratings

---

## Booking Service

Responsibilities

- Availability
- Calendars
- Scheduling
- Time zones
- Rescheduling
- Waitlists

---

## Meeting Service

Responsibilities

- Video calls
- WebRTC
- Waiting rooms
- Recording
- Live transcription

Technology

- mediasoup
- Coturn
- WebRTC

---

## CRM Service

Responsibilities

- Contacts
- Leads
- Tasks
- Notes
- Pipelines
- Activity history

---

## Accounting Service

Responsibilities

- Invoices
- Expenses
- Revenue
- Lawyer payouts
- Taxes

---

## Subscription Service

Responsibilities

- Plans
- Billing
- Renewals
- Coupons
- Trials

---

## Notification Service

Responsibilities

- Email
- Push
- SMS
- WhatsApp
- In-app notifications

---

## Analytics Service

Responsibilities

- KPIs
- Reports
- Revenue
- User analytics
- AI metrics

---

# AI Architecture

The AI layer is a shared platform service.

It provides:

- Chat completion
- Voice interaction
- Summarization
- Intent detection
- Recommendation
- Classification
- Translation (future)
- Embeddings (future)

No module communicates directly with AI providers.

Instead:

Client

↓

AI Service

↓

Model Router

↓

Gemini / Local Models

This allows changing providers without affecting business logic.

---

# AI Components

## AI Chat

Conversational intake.

---

## AI Voice

Speech-to-text

↓

Intent

↓

LLM

↓

Text-to-speech

---

## AI Recommendation Engine

Inputs

- Practice area
- Jurisdiction
- Lawyer expertise
- Availability
- Rating
- Conflicts

Outputs

- Ranked lawyer list

---

## AI Summarizer

Converts

Meeting

↓

Transcript

↓

Summary

↓

CRM Notes

---

# Data Layer

Primary Database

- PostgreSQL

Cache

- Redis

File Storage

- Supabase Storage

Search

- PostgreSQL Full-Text Search (V1)
- Elasticsearch/OpenSearch (Future)

---

# External Integrations

Payments

- Stripe

AI

- Gemini
- Ollama

Voice

- Whisper
- Piper

Email

- Resend

Push

- Firebase Cloud Messaging

SMS

- Twilio (future)

WhatsApp

- Meta WhatsApp Cloud API

---

# Security Architecture

Authentication

↓

Authorization

↓

Validation

↓

Business Rules

↓

Audit Logging

↓

Database

Every request follows this chain.

---

# Event Flow

Example:

Client books meeting

↓

Booking Service

↓

Database

↓

Notification Event

↓

Email

↓

Push Notification

↓

Calendar Update

↓

CRM Update

↓

Analytics Event

Every important action emits domain events.

---

# Deployment Architecture

Internet

↓

Cloudflare

↓

Reverse Proxy

↓

Next.js

↓

Supabase

↓

AI Services

↓

Database

Production and staging environments must remain isolated.

---

# Scalability Strategy

Horizontal scaling

- API services
- AI services
- Web servers

Vertical scaling

- Database

Caching

- Redis

CDN

- Cloudflare

Async processing

- Background workers
- Queues

---

# Observability

The platform must provide:

- Structured logging
- Metrics
- Error tracking
- Performance monitoring
- Health checks
- AI usage metrics

---

# Disaster Recovery

Daily backups

Point-in-time recovery

Database replication

Infrastructure as Code

Documented recovery procedures

---

# Future Architecture

Future capabilities include:

- Microservices
- Kubernetes
- Event streaming
- Multi-region deployment
- AI orchestration layer
- Knowledge graph
- RAG architecture
- Agent-to-agent communication

---

# Architecture Decision Records (ADR)

Major engineering decisions must be documented as ADRs.

Each ADR must include:

- Context
- Decision
- Alternatives considered
- Trade-offs
- Consequences
- Implementation notes

---

# Success Criteria

The architecture must:

✓ Support rapid feature development

✓ Scale horizontally

✓ Be AI-native

✓ Maintain security by default

✓ Minimize coupling

✓ Maximize maintainability

✓ Support future enterprise expansion

✓ Remain understandable by both engineers and AI coding assistants