# Barristrly — Complete Project Documentation

> **Privacy-First Legal Services Marketplace**
> AI-powered intake, anonymous lawyer matching, escrow payments, and encrypted consultations across UAE, GCC, and Pakistan.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Marketing Pages](#marketing-pages)
5. [Authentication Pages](#authentication-pages)
6. [Dashboard — Client](#dashboard--client)
7. [Dashboard — Lawyer](#dashboard--lawyer)
8. [Dashboard — Mediator](#dashboard--mediator)
9. [Meeting Room](#meeting-room)
10. [API Routes](#api-routes)
11. [Key Components](#key-components)
12. [Business Logic](#business-logic)

---

## Project Overview

Barristrly is a Next.js 16 application that serves as a **legal services marketplace** connecting clients with verified lawyers. The platform's core differentiators are:

- **AI-Powered Intake**: Natural language case submission that auto-extracts jurisdiction, case type, and urgency
- **Double-Blind COI Vetting**: Conflict-of-interest checks execute before any case details are shared with lawyers
- **Anonymous Matching**: Clients remain anonymous (silhouette masks, voice morphing) until dual consent is granted
- **Milestone Escrow**: Funds are held in Stripe-protected escrow and released only upon milestone completion
- **Encrypted Consultations**: Jitsi-based video calls with voice morphing and silhouette masking

### User Roles

| Role | Description |
|------|-------------|
| **Client** | Submits legal cases, gets matched with lawyers, attends encrypted consultations |
| **Lawyer** | Receives pre-vetted leads, manages profile, conducts consultations, runs sponsored ads |
| **Mediator** | Platform admin — oversees matching, approves lawyers, reviews COI flags, manages accounting |

### Target Markets

- UAE (Dubai, Abu Dhabi, DIFC, ADGM)
- GCC countries (Saudi Arabia, Kuwait, Bahrain, Oman, Qatar)
- Pakistan
- UK (London)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Radix UI, Framer Motion |
| Forms | React Hook Form + Zod validation |
| Auth | Supabase Auth (with Firebase compatibility layer) |
| Database | Supabase PostgreSQL with Row Level Security (RLS) |
| Payments | Stripe (Checkout Sessions, Webhooks, Subscriptions) |
| Video | Jitsi React SDK |
| State | React Context (AuthProvider) |
| Styling | shadcn/ui components, Tailwind, tw-animate-css |

---

## Database Schema

21 PostgreSQL tables with Row Level Security policies. Key tables:

### Users & Profiles

| Table | Purpose |
|-------|---------|
| `users` | Core user records (id, email, role, status) linked to `auth.users` |
| `client_profiles` | Client preferences (language, contact preference) |
| `lawyer_profiles` | Public lawyer directory (practice areas, jurisdictions, rating, bio, hourly rate, verification status, subscription tier) |
| `mediator_profiles` | Mediator display names |
| `lawyer_approvals` | Pending/approved/rejected lawyer applications |

### Matching & Leads

| Table | Purpose |
|-------|---------|
| `leads` | Case requests with status pipeline (open → matched → screening → consulting → engaged → completed) |
| `lead_notes` | Internal notes on leads |
| `lead_activity` | Activity log for lead state changes |
| `lawyer_matches` | Score-based matching records (score, confidence, rank, primary flag) |

### Payments & Escrow

| Table | Purpose |
|-------|---------|
| `payments` | All payment records (intake fees, meeting fees, subscriptions, escrow) |
| `escrow_accounts` | Milestone escrow with dual-confirmation (client + lawyer) |
| `accounting_entries` | Financial ledger (revenue, escrow holds/releases, refunds, subscriptions) |

### Privacy & Compliance

| Table | Purpose |
|-------|---------|
| `dual_consent` | Both-party consent before contact reveal |
| `coi_screens` | Conflict-of-interest screening records |
| `audit_logs` | System-wide audit trail (mediator-only access) |

### Meetings & Communication

| Table | Purpose |
|-------|---------|
| `meetings` | Scheduled video meetings with Jitsi room names |
| `ice_candidates` | WebRTC signaling candidates |
| `meeting_messages` | In-meeting chat messages |
| `meeting_transcripts` | Post-meeting transcript storage |

### Other

| Table | Purpose |
|-------|---------|
| `lawyer_ads` | Sponsored directory listings (pending → active → paused/expired) |
| `chat_sessions` | AI intake chatbot session state |

---

## Marketing Pages

### Homepage — `/`

**File:** `app/(marketing)/page.tsx` (1646 lines)

The main landing page with the following sections:

1. **Hero Section**
   - Animated headline with trust pills (Verified lawyers, COI screened, Dual consent)
   - Stats: 300+ vetted firms, <12 min avg match, 5 countries
   - Interactive "Intake Workspace" mockup with 4 tabs:
     - **COI Vetting**: Shows firm screening results (Cleared/Conflicted)
     - **AI Briefing**: Natural language case intake with typing animation
     - **Secure Escrow**: Milestone-based fund allocation display
     - **Consult Sandbox**: Anonymous video session mockup
   - Floating cards: Matched lawyer profile, Escrow shield, Identity mask

2. **Partner Logo Ticker** — ADGM Registry, DIFC Courts, Dubai Land Dept., UAE Laws Applied, GCC Arbitration, Abu Dhabi Courts, London Commercial Court

3. **Stats Section** — Animated counters for key metrics

4. **Platform Showcase** — Product tour with 4 interactive tabs:
   - AI Briefing: Case intake with structured tags and match probability
   - Conflict Vetting: Double-blind hash verification logs
   - Milestone Escrow: Fund release/lock status
   - Consult Sandbox: Encrypted peer session with voice morphing

5. **Connections Integration Hub** — Visual node diagram showing integrations (Slack, Stripe, ADGM, DIFC)

6. **Bento Features Grid**
   - Natural Language AI Intake (double-wide)
   - Double-Blind Vetting
   - Ephemeral Sandboxes
   - Milestone Escrow
   - Dual Consent Gate
   - Global Jurisdiction Router

7. **Security Section** — Encrypted sandboxing, biometric tag clearing, WebRTC voice morphing

8. **Pricing Section** — Three tiers with per-case/yearly toggle:
   - Intake Starter: $0 (free forever)
   - Intake Pro: $49/month
   - Enterprise Elite: $99/month

9. **Testimonials** — Three client testimonial cards

10. **FAQ Section** — Six accordion items

11. **Final CTA** — Newsletter signup

---

### About — `/about`

**File:** `app/(marketing)/about/page.tsx` (331 lines)

- Founder biography: Heena Mohammed, Co-Founder & Chairperson
- Professional background, commercial leadership (Shezz Group of Companies)
- Corporate Vision & Manifesto
- Problem statement: Structural legal gap between India and GCC
- Solution: Mediating bridge of trust
- Four Core Pillars: High-Precision Alignment, Client Anonymity, Elimination of Financial Friction, India-GCC Legal Corridor

---

### Browse by Specialty — `/browse`

**File:** `app/(marketing)/browse/page.tsx` (55 lines)

- CategoryGrid component for practice areas
- Reassurance text strip
- AI bot CTA and journey navigation

---

### Conflict of Interest — `/conflict-of-interest`

**File:** `app/(marketing)/conflict-of-interest/page.tsx` (23 lines)

- FiveStepCorePage layout
- COI Marketing Flow Diagram
- Technical Appendix
- Cross-links to Encrypted Consultations, Trust & Security, Why Barristrly

---

### Lawyer Directory — `/directory`

**File:** `app/(marketing)/directory/page.tsx` (135 lines)

- Search filters sidebar (practice area, jurisdiction, rating, experience)
- Sponsored lawyer profiles section
- Public lawyer cards with anonymous labels
- URL search params: `practiceArea`, `jurisdiction`, `q`, `minRating`, `minExperience`

---

### Individual Lawyer Profile — `/directory/[id]`

**File:** `app/(marketing)/directory/[id]/page.tsx` (151 lines)

- Masked lawyer avatar and name
- Rating, experience, hourly range
- Practice areas, jurisdictions, languages
- Privacy badge
- "Request Match" CTA → `/intake`

---

### Encrypted Consultations — `/encrypted-consultations`

**File:** `app/(marketing)/encrypted-consultations/page.tsx` (49 lines)

- FiveStepCorePage layout
- Process flow: Select Slot → Masked Session → Encrypted Meet
- Calendar sync visual

---

### For Lawyers — `/for-lawyers`

**File:** `app/(marketing)/for-lawyers/page.tsx` (177 lines)

- Platform stats: 3x leads, 100% COI screened, 4+ jurisdictions, 24/7 intake
- Benefits grid: Zero listing fees, pre-vetted leads, conflict clearing, 12h SLA, tokenized compliance, Stripe escrow
- Supply-side framework component
- Pricing summary
- CTA to `/register/lawyer`

---

### For Clients — `/for-clients`

**File:** `app/(marketing)/for-clients/page.tsx` (5 lines)

- Redirects to `/services#clients`

---

### How It Works — `/how-it-works`

**File:** `app/(marketing)/how-it-works/page.tsx` (48 lines)

- 7-step journey description
- CTA to `/#process` for full visualization

---

### Legal Intake — `/intake`

**File:** `app/(marketing)/intake/page.tsx` (10 lines)

- Renders `<IntakePageClient />` — the AI-powered chat intake interface

---

### Pricing — `/pricing`

**File:** `app/(marketing)/pricing/page.tsx` (77 lines)

- Hash-based tab switching (`#clients` / `#lawyers`)
- `ClientPricingSection` and `LawyerPricingSection` components

---

### Privacy Policy — `/privacy`

**File:** `app/(marketing)/privacy/page.tsx` (291 lines)

Privacy Policy & Data Protection Master Agreement (June 2026). Sections:
1. Categories of Privacy Data Ingested (Expert Metadata, Client Account, Conflict Filtering Logs, Tracking Telemetry)
2. Anonymous Routing Interface and Session Transfers
3. Data Mechanics of Automated COI Checks
4. Programmatic Third-Party Advertising Integrations
5. Information Expulsion, Retention, and Data Rights
6. Privacy Indemnification Protocol
7. Global Transfers and Platform Security Limitations
8. Jurisdiction and Future Adjustments

---

### Our Services — `/services`

**File:** `app/(marketing)/services/page.tsx` (57 lines)

- Global corridor framework description
- CTAs to homepage and intake

---

### Terms and Conditions — `/terms`

**File:** `app/(marketing)/terms/page.tsx` (522 lines)

Master User Agreement (June 2026). Sections:
1. Definitions and Defined Parties
2. Tech-Only Aggregator Matrices & Exclusion of Attorney Relationships
3. Exclusion of Liability for Difficulties Between Clients and Service Providers
4. Anonymous Merit-Based Directory Architecture & Technical Unmasking Protection
5. Mandatory Platform-Integrated Conflict Engine
6. Third-Party Banner Advertising and Financial Services Integrations
7. Multi-Party Civil Indemnification Framework
8. Limitation of Liability and Maximum Indemnity Financial Ceiling
9. System Protection and Right to Suspend
10. Proprietary VoIP Scheduler & Anti-Circumvention Covenants
11. Financial Isolation & Billing Dispute Protection
12. Governing Law, Forum Selection, and Severability
13. Updates to Terms and Conditions

---

### Trust & Security — `/trust-and-security`

**File:** `app/(marketing)/trust-and-security/page.tsx` (40 lines)

- FiveStepCorePage layout
- Process flow: Credential Check → Zero-Knowledge Intake → Routing Approved
- Cross-links to Why Barristrly, Lawyer Directory, COI Shield

---

### Why Barristrly — `/why-barristrly`

**File:** `app/(marketing)/why-barristrly/page.tsx` (48 lines)

- Seven pillars of protected legal care
- CTA to `/#why-us` for full details

---

## Authentication Pages

### Layout — `app/(auth)/layout.tsx`

Shared layout wrapping all auth pages with `SiteHeader`, `SiteFooter`, and `HomeHeroDecor`.

### Login — `/login`

**File:** `app/(auth)/login/page.tsx` (20 lines)

- Suspense-wrapped `LoginForm` component
- Email/password authentication via Supabase

### Register — `/register`

**File:** `app/(auth)/register/page.tsx` (204 lines)

- Role picker (Client / Lawyer)
- Fields: Full name, email, password, confirm password
- React Hook Form + Zod validation
- Calls `signUp()` from Supabase auth
- Lawyers → redirect to profile setup
- Clients → redirect to verify-email

### Register Lawyer — `/register/lawyer`

- Redirects to `/register`

### Forgot Password — `/forgot-password`

**File:** `app/(auth)/forgot-password/page.tsx` (124 lines)

- Email input form
- Calls `resetPassword()` from Supabase auth
- Success state: "Check your email for a password reset link"

### Verify Email — `/verify-email`

**File:** `app/(auth)/verify-email/page.tsx` (75 lines)

- Shows user's email address
- Resend verification email button
- "Continue to dashboard" link

---

## Dashboard — Client

### Client Overview — `/dashboard/client`

**File:** `app/(dashboard)/dashboard/client/page.tsx` (94 lines)

- Stat cards: Active Requests, Total Requests, Meetings (coming Phase 3)
- Recent requests list with status badges
- "New Legal Request" CTA
- Navigation: Overview, My Requests, New Intake, Meetings, Payments, Settings

---

### My Requests — `/dashboard/client/requests`

**File:** `app/(dashboard)/dashboard/client/requests/page.tsx` (97 lines)

- List of all legal requests with:
  - Case type, jurisdiction, budget, urgency
  - Status badges (new, qualified, matched, meeting_booked, completed, invoiced, closed)
  - "View Details" link to individual request

---

### Request Detail — `/dashboard/client/requests/[id]`

**File:** `app/(dashboard)/dashboard/client/requests/[id]/page.tsx` (246 lines)

- Intake summary card (jurisdiction, budget, urgency, language, contact preference, COI status)
- Matched lawyers section with anonymous profiles
- Dual consent panel (client ↔ lawyer)
- Meeting scheduling / join button
- Meeting transcripts with PDF export
- Intake chat transcript with PDF export

---

### New Intake — `/dashboard/client/intake`

- Redirects to `/intake`

---

### Meetings — `/dashboard/client/meetings`

**File:** `app/(dashboard)/dashboard/client/meetings/page.tsx` (157 lines)

- Schedule meetings for leads with assigned lawyers
- List of existing meetings with status badges
- Join button for active meetings
- Jitsi Meet integration with anonymous labels

---

### Payments — `/dashboard/client/payments`

**File:** `app/(dashboard)/dashboard/client/payments/page.tsx` (212 lines)

- Pay for services: Intake fee, Meeting escrow
- Stripe Checkout integration
- Payment history with status badges (succeeded, pending, failed, refunded)
- Escrow status display per lead

---

### Settings — `/dashboard/client/settings`

**File:** `app/(dashboard)/dashboard/client/settings/page.tsx` (53 lines)

- Account info: Name, Email, Role (read-only)

---

## Dashboard — Lawyer

### Lawyer Overview — `/dashboard/lawyer`

**File:** `app/(dashboard)/dashboard/lawyer/page.tsx` (105 lines)

- Stat cards: New Leads, Acceptance Rate, Profile Views
- Pending approval banner (if status is pending)
- Profile status card: Public Listing (Live/Hidden), Verified (Yes/Pending), Practice Areas count
- Navigation: Overview, Leads, Meetings, Advertising, Profile, Subscription, Settings

---

### Leads — `/dashboard/lawyer/leads`

**File:** `app/(dashboard)/dashboard/lawyer/leads/page.tsx` (103 lines)

- Incoming matched leads with:
  - Case type, jurisdiction, budget, urgency, language
  - Match score percentage
  - Status badges
- Dual consent panel for each lead (lawyer side)

---

### Meetings — `/dashboard/lawyer/meetings`

**File:** `app/(dashboard)/dashboard/lawyer/meetings/page.tsx` (94 lines)

- List of scheduled meetings with client labels
- Status badges (scheduled, active, ended)
- Join button for active meetings

---

### Advertising — `/dashboard/lawyer/advertising`

**File:** `app/(dashboard)/dashboard/lawyer/advertising/page.tsx` (202 lines)

- Create sponsored listing form:
  - Headline (10-120 chars)
  - Practice Area (dropdown)
  - Jurisdiction (dropdown)
- Existing ads list with:
  - Headline, practice area, jurisdiction
  - Impression count
  - Status badge (active, pending, paused, rejected)
  - Pause button for active ads

---

### Profile — `/dashboard/lawyer/profile`

**File:** `app/(dashboard)/dashboard/lawyer/profile/page.tsx` (252 lines)

Editable profile form with:
- Display name, years of experience, hourly rate range (min/max), bio
- Practice areas (checkbox grid from constants)
- Jurisdictions (checkbox grid from constants)
- Languages (checkbox grid from constants)
- React Hook Form + Zod validation
- Auto-generates initials from display name

---

### Subscription — `/dashboard/lawyer/subscription`

**File:** `app/(dashboard)/dashboard/lawyer/subscription/page.tsx` (140 lines)

- Current subscription tier badge
- Lite tier plans (solo practitioners) — 2-column grid
- Growth tier plans — 3-column grid
- Stripe Checkout integration for plan purchase
- Stripe configuration warning card

---

### Settings — `/dashboard/lawyer/settings`

**File:** `app/(dashboard)/dashboard/lawyer/settings/page.tsx` (55 lines)

- Account info: Name, Email, Status (read-only)

---

## Dashboard — Mediator

### Mediator Overview — `/dashboard/mediator`

**File:** `app/(dashboard)/dashboard/mediator/page.tsx` (108 lines)

- Stat cards: Total Leads, Pending Approvals, COI Flagged
- Pipeline summary with lead counts per stage
- Quick Actions: Approvals, CRM Pipeline, COI Queue, Accounting & Ledger
- Navigation: Overview, Approvals, CRM, COI Queue, Reports, Settings

---

### Approvals — `/dashboard/mediator/approvals`

**File:** `app/(dashboard)/dashboard/mediator/approvals/page.tsx` (147 lines)

- Queue of pending lawyer applications
- Each card shows: Display name, email, submission date
- Action buttons: Approve (with CheckCircle) / Reject (with XCircle)
- Skeleton loading placeholders

---

### CRM Pipeline — `/dashboard/mediator/crm`

**File:** `app/(dashboard)/dashboard/mediator/crm/page.tsx` (261 lines)

- **Kanban view**: Drag-and-drop columns per pipeline stage
  - Draggable lead cards with case type, jurisdiction, COI status
  - Uses `@dnd-kit/core` and `@dnd-kit/sortable`
  - DragOverlay for ghost card during drag
  - Optimistic status updates on drop
- **Table view**: All leads in a sortable table
  - Columns: Case Type (linked), Jurisdiction, Status, COI Status, Created Date
- Toggle between views via tabs

---

### COI Queue — `/dashboard/mediator/coi`

**File:** `app/(dashboard)/dashboard/mediator/coi/page.tsx` (223 lines)

- Flagged COI screening records
- Each card shows:
  - Associated lead info (case type, jurisdiction, budget, urgency)
  - Triggered COI questions (human-readable)
  - All COI question answers (Yes/No badges)
  - Link to lead detail or chat session
- Mediator notes textarea
- Action buttons: Clear & Resume Matching, Escalate, Close Inquiry
- Actions sent to `/api/mediator/coi` endpoint

---

### Accounting — `/dashboard/mediator/accounting`

**File:** `app/(dashboard)/dashboard/mediator/accounting/page.tsx` (140 lines)

- Stat cards: Total Revenue, Escrow Held, Escrow Released (currency formatted)
- General Ledger table:
  - Columns: Date, Type (badge), Description, Amount
  - Types: Revenue, Subscription, Escrow Hold, Escrow Release, Refund
- Entries created via Stripe webhooks

---

### Advertising — `/dashboard/mediator/advertising`

**File:** `app/(dashboard)/dashboard/mediator/advertising/page.tsx` (124 lines)

- Pending ads moderation queue
- Each ad shows: Headline, practice area, jurisdiction, lawyer ID
- Action buttons: Approve (sets status to "active") / Reject (sets status to "rejected")
- Empty state: "No pending ads — all caught up."

---

### Reports — `/dashboard/mediator/reports`

**File:** `app/(dashboard)/dashboard/mediator/reports/page.tsx` (84 lines)

- Stat cards: Total Leads, Pending Approvals, Closed Leads
- Pipeline Breakdown with visual progress bars
  - Each stage: label, count, percentage, horizontal fill bar

---

### Settings — `/dashboard/mediator/settings`

**File:** `app/(dashboard)/dashboard/mediator/settings/page.tsx` (53 lines)

- Account info: Name, Email, Role (read-only)

---

## Meeting Room

### Meeting Room — `/meeting/[id]`

**File:** `app/meeting/[id]/page.tsx` (81 lines)

- Loads meeting by ID
- Auth check + participant authorization (client or lawyer only)
- Renders `JitsiRoom` component with:
  - Display label (anonymous until dual consent)
  - "Back to Meetings" navigation
- Leave action redirects to appropriate dashboard

---

## API Routes

### Stripe Integration

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stripe/checkout/intake` | POST | Create Stripe Checkout for intake processing fee |
| `/api/stripe/checkout/meeting` | POST | Create Stripe Checkout for meeting escrow payment |
| `/api/stripe/checkout/subscription` | POST | Create Stripe Checkout for lawyer subscription (recurring monthly) |
| `/api/stripe/webhook` | POST | Handle `checkout.session.completed` events — update payments, create escrows, update subscription tiers, record accounting entries |

### Authentication

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/session` | POST | Create server-side session from Firebase ID token (sets HTTP-only cookie, 5-day expiry) |
| `/api/auth/logout` | POST | Clear auth cookie |

### Core Business

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/intake/chat` | POST, GET | AI intake chatbot — process chat turns, handle COI evaluation, generate lawyer match previews, create leads |
| `/api/consent/grant` | POST | Grant dual consent — reveals contact info when both parties consent |
| `/api/escrow/confirm` | POST | Confirm escrow release — dual-party confirmation triggers fund release |
| `/api/mediator/coi` | POST | Mediator COI actions: clear (resume matching), escalate, or close (with refund) |

### System

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check — returns `{ ok: true, service: "barristrly" }` |

---

## Key Components

### UI Components (`components/ui/`)

Standard shadcn/ui components: Button, Input, Label, Textarea, Checkbox, Card, Badge, Skeleton, Tabs, Table, Select, Tooltip, Sonner (toast)

### Marketing Components (`components/marketing/`)

- `SiteHeader` / `SiteFooter` — Navigation and footer
- `BrandLogo` / `BrandWordmark` — Brand identity
- `HeroVideoPanel` — Hero section video panel
- `SectionHeading` — Reusable section headers
- `MatchLawyerTriggerButton` — CTA dialog for lawyer matching
- `ThemeSwitcher` — Theme selection (royal, champagne, sunset, burnt-orange)
- `HomeHeroDecor` — Decorative hero background
- `PageTaglineHero` — Page header with tagline
- `CategoryGrid` — Practice area browser
- `AiBotCtaBand` / `JourneyNavStrip` — Navigation aids
- `FiveStepCorePage` — Template for feature pages (COI, Encrypted Consultations, Trust & Security)
- `LawyerCard` — Directory listing card
- `MaskedLawyerAvatar` / `MaskedLawyerName` — Anonymous identity display
- `DirectoryPrivacyBadge` — Privacy indicator

### Dashboard Components (`components/dashboard/`)

- `DashboardShell` — Sidebar + main content layout with role-specific navigation
- `StatCard` — Metric display card with icon

### Matching Components (`components/matching/`)

- `MatchCard` — Lawyer match display with score and profile

### Payment Components (`components/payments/`)

- `DualConsentPanel` — Consent management UI for client ↔ lawyer

### Meeting Components (`components/meetings/`)

- `JitsiRoom` — Jitsi Meet video call integration

### Intake Components (`components/intake/`)

- Chat-based intake interface components

### Directory Components (`components/directory/`)

- Lawyer directory listing and filtering components

### Subscription Components (`components/subscription/`)

- `LawyerPlanCard` — Subscription plan display card

---

## Business Logic

### Matching Engine (`lib/matching/engine.ts`)

Score-based lawyer matching that considers:
- Practice area alignment
- Jurisdiction compatibility
- Rating and experience
- Language match
- Subscription tier

### Intake System (`lib/intake/`)

- `chat-engine.ts` — State machine for intake chat flow (greeting → intake → coi → matching → lawyer_selection → payment → complete)
- `coi-engine.ts` — Conflict-of-interest evaluation logic
- `questionnaire.ts` — Dynamic question generation
- `llm.ts` — Ollama LLM integration for natural language enrichment
- `case-discovery.ts` — Case category discovery
- `faq-corpus.ts` — FAQ knowledge base

### Stripe Integration (`lib/stripe/`)

- `client.ts` — Client-side Stripe checkout helpers
- `config.ts` — Stripe configuration
- `constants.ts` — Fee amounts, plan IDs
- `auth.ts` — Server-side Stripe authentication

### Privacy (`lib/privacy/`)

- Anonymous routing and identity masking
- Voice morphing parameters
- Silhouette generation

### Export (`lib/export/`)

- `transcript-pdf.ts` — PDF export for meeting and chat transcripts

### Validators (`lib/validators/`)

- Zod schemas for all forms: register, login, forgot-password, lawyer profile, COI answers, etc.

### Constants (`lib/constants/`)

- `PRACTICE_AREAS` — List of legal practice areas
- `JURISDICTIONS` — Supported jurisdictions
- `LANGUAGES` — Supported languages

### Hooks (`hooks/`)

- `use-auth.ts` — Authentication state and user profile
- `use-mobile.ts` — Mobile device detection
- `use-webrtc.ts` — WebRTC connection management

### Contexts (`contexts/`)

- `auth-provider.tsx` — Global authentication provider wrapping the app

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration (inferred from postcss.config.mjs) |
| `postcss.config.mjs` | PostCSS with Tailwind plugin |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.mjs` | ESLint configuration |
| `components.json` | shadcn/ui component configuration |
| `apphosting.yaml` | App hosting configuration |
| `.env` | Environment variables |
| `.mcp.json` | MCP server configuration |
| `middleware.ts` | Next.js middleware (auth redirects) |
| `instrumentation.ts` | OpenTelemetry instrumentation |

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/seed-users.ts` | Seed database with test users |

---

## Deployment

- **Platform**: Vercel (via `apphosting.yaml`)
- **Start command**: `next start -H 0.0.0.0 -p ${PORT:-8080}`
- **Build**: `next build --webpack`

---

*Last updated: July 2026*
