# Platform implementation status

Living checklist for the Barristrly SaaS plan (marketplace-first).

## Structure (corrected)

```
apps/web/src/{app,components,features,lib,styles}
packages/ui
supabase/
```

Portal URLs: `/client`, `/lawyer`, `/admin` (no nested `/app/app`).

## Phase 0 foundation polish

| Surface | Behavior |
| --- | --- |
| Portal middleware | Unauthenticated `/client` `/lawyer` `/admin` → `/login?next=` |
| Role guard | Wrong role redirected to role home (`homeForRole`) |
| Admin APIs | `requireAdminService` — `platform_admin` \| `mediator` \| `firm_admin` only (no staging fallback) |
| Login / register | Role-aware landing + safe `?next=` via `resolvePostAuthRedirect` |
| Bootstrap admin | Set `users.role = 'platform_admin'` in Supabase for your operator account |

| Phase | Status | Notes |
| --- | --- | --- |
| 0 Foundation | Demoable | Auth gates, portal middleware, role login, CI |
| 1 Marketplace MVP | Demoable | Admin approve → intake → matches → consent → meetings → escrow |
| 2 Thin Client Portal | Demoable | Matter = engaged lead; timeline, notes, messages, billing |
| 3 Practice Core / CRM | Demoable | Pipeline, clients, calendar status, profile, ledger (no `crm_*` tables) |
| 4 Documents MVP | Demoable | `documents` + `matter-documents` bucket; upload/version/download/archive |
| 5 AI Platform | Demoable | Gemini/stub gateway; matter AI + chat_sessions persistence |
| 6 Litigation & CLM | Demoable | `matter_deadlines` + `contracts` on leads |
| 7 Enterprise | Demoable | Admin analytics, audit, billing, ads, compliance (no mobile/SSO) |
| 8 Intelligence | Demoable | Insights, outcomeFit ranking, next actions, executive brief |

## Phase 1 loop (live schema)

| Step | Path / API | Persistence |
| --- | --- | --- |
| Approve lawyer | `/admin/lawyers` · `GET/POST /api/v1/admin/lawyer-approvals` | `lawyer_approvals` + `lawyer_profiles.is_verified/is_public` |
| Intake | `/client/intake` · `POST /api/v1/intake` | `leads` |
| Match | `/client/matches?leadId=` · `POST /api/v1/matches` | `coi_screens` + `lawyer_matches` |
| Dual consent | Grant on match / lawyer lead · `POST /api/v1/consent` | `dual_consent.contact_revealed` |
| Book | `/client/bookings` · `POST /api/v1/bookings` | `meetings` (mediasoup room in `jitsi_room_name`) |
| Pay | Pay escrow on bookings · `POST /api/v1/payments` | `payments` + `escrow_accounts` |
| Lawyer inbox | `/lawyer/leads` · `GET /api/v1/lawyer/leads` | reads `lawyer_matches` |

## Phase 2 thin portal (live schema)

Matter = `leads` with status `consulting` \| `engaged` \| `completed` (no separate `matters` table).

| Surface | Path / API | Persistence |
| --- | --- | --- |
| Matter list | `/client/matters`, `/lawyer/matters` · `GET /api/v1/matters` | `leads` |
| Matter detail | `/client/matters/[id]`, `/lawyer/matters/[id]` · `GET /api/v1/matters/[id]` | `leads` + consent mask |
| Timeline | detail · `GET/POST /api/v1/matters/[id]/activity` | `lead_activity` |
| Notes | detail · `GET/POST /api/v1/matters/[id]/notes` | `lead_notes` |
| Messages | detail · `GET/POST /api/v1/matters/[id]/messages` | `meeting_messages` (needs meeting) |
| Billing | detail · `GET /api/v1/matters/[id]/billing` | `payments` + `escrow_accounts` |

## Phase 3 practice core (live schema)

No `crm_*` tables — CRM maps onto leads / meetings / profiles / accounting / audit.

| Surface | Path / API | Persistence |
| --- | --- | --- |
| Clients | `/lawyer/clients` · `GET /api/v1/lawyer/clients` | distinct clients from leads |
| Pipeline | `/lawyer/leads` · `GET/PATCH /api/v1/lawyer/pipeline` | `leads.status` + activity + audit |
| Calendar | `/lawyer/calendar` · `PATCH /api/v1/meetings/[id]` | `meetings.status` |
| Profile | `/lawyer/profile` · `GET/PATCH /api/v1/lawyer/profile` | `lawyer_profiles` (not verify/public) |
| Ledger / audit | `/lawyer/accounting` · `GET /api/v1/lawyer/accounting` + `/audit` | `accounting_entries` + `audit_logs` |

## Phase 4 documents MVP (live schema)

New table `documents` (`lead_id` = matter) + private Storage bucket `matter-documents`. Local migration `20260718000004` (matters/profiles) is **not** applied.

| Surface | Path / API | Persistence |
| --- | --- | --- |
| List / upload | Matter detail · `GET/POST /api/v1/documents?leadId=` | `documents` + storage |
| Download / archive | `GET/DELETE /api/v1/documents/[id]` | signed URL · soft archive |
| Version replace | `POST /api/v1/documents/[id]/versions` | bumps `version`, new path |

## Phase 5 AI platform (live schema)

No new AI tables — threads in `chat_sessions.data`. Gemini when `GEMINI_API_KEY` set; otherwise stubs (`gated: true`).

| Surface | Path / API | Persistence |
| --- | --- | --- |
| Gateway | `POST /api/v1/ai` · agents intake/summarize/draft/research | Gemini or stub |
| Session | `GET /api/v1/ai?sessionId=` | `chat_sessions` |
| Matter UI | Matter detail AI assistant | summarize / draft + human-review banner |
| Intake | `POST /api/v1/intake` | uses Gemini intake agent when keyed |

## Phase 6 litigation & CLM (live schema)

| Surface | Path / API | Persistence |
| --- | --- | --- |
| Deadlines | Matter detail · `GET/POST /api/v1/matters/[id]/deadlines` | `matter_deadlines` |
| Deadline update | `PATCH /api/v1/deadlines/[id]` | status / due_at |
| Lawyer inbox | `/lawyer/deadlines` · `GET /api/v1/lawyer/deadlines` | open deadlines across leads |
| Contracts | Matter detail · `GET/POST /api/v1/matters/[id]/contracts` | `contracts` |
| Contract status | `PATCH /api/v1/contracts/[id]` | draft → in_review → executed… |

## Phase 7 enterprise (live schema)

Web admin console only — no mobile app, SSO, SCIM, or org-scoped webhooks. New table `analytics_events` (`user_id` → `users`). Admin APIs use service role after role check (audit RLS is mediator-only).

| Surface | Path / API | Persistence |
| --- | --- | --- |
| Overview KPIs | `/admin` · `GET /api/v1/admin/analytics` | aggregates + `analytics_events` |
| Analytics | `/admin/analytics` | same |
| Audit center | `/admin/audit` · `GET /api/v1/admin/audit` | `audit_logs` |
| Billing | `/admin/billing` · `GET /api/v1/admin/billing` | `payments` + `escrow_accounts` |
| Ads | `/admin/ads` · `GET/PATCH /api/v1/admin/ads` | `lawyer_ads` |
| COI | `/admin/coi` · `GET /api/v1/admin/coi` | `coi_screens` |
| Compliance | `/admin/compliance` · `GET /api/v1/admin/compliance` | checklist + counts |
| Webhook test | `POST /api/v1/webhooks/test` | HMAC sign/verify (no DB) |
| Event emit | intake / matches / payments | `analytics_events` via `trackEvent` |

## Phase 8 intelligence (live schema)

No new tables — insights computed on the fly. Match ranking includes `outcomeFit` from historical matches/meetings.

| Surface | Path / API | Persistence |
| --- | --- | --- |
| Lawyer insights | `/lawyer` · `GET /api/v1/lawyer/insights` | matches / meetings / escrow / deadlines |
| Client NBA | `/client` · matter detail · `GET /api/v1/client/insights?leadId=` | ranked `primary` + `secondary` |
| NBA events | `POST /api/v1/insights/nba-event` | `analytics_events` (`nba.click` / `nba.dismiss`) |
| Admin tips | `/admin/insights` · `GET /api/v1/admin/insights` | KPI aggregates |
| Executive brief | `POST /api/v1/admin/insights/brief` | Gemini/stub + `intelligence.brief` event |
| Match ranking | `POST /api/v1/matches` | `explanation.outcomeFit` in response |

NBA depth: shared `NextBestActionBanner` with session dismiss; funnel rules cover match → consent → book → escrow → matter update.

## Verify

```bash
npm run dev
curl -s http://localhost:3000/api/v1/health
open http://localhost:3000/client/intake
```

Smoke Phase 1: approve lawyer → intake → matches → book → pay escrow → dual consent.  
Smoke Phase 2: open `/client/matters` → matter detail → note + message + confirm escrow release.  
Smoke Phase 3: `/lawyer/leads` pipeline move → `/lawyer/clients` → calendar status → profile save → accounting after escrow release.  
Smoke Phase 4: on a matter, upload PDF → download → replace (version bump) → archive.  
Smoke Phase 5: on a matter, run summarize/draft AI → confirm session id returned; optional GEMINI_API_KEY for live.  
Smoke Phase 6: add deadline + contract on matter → advance contract status → check `/lawyer/deadlines`.  
Smoke Phase 7: as admin open `/admin` KPIs → audit → billing → ads → compliance → COI; `POST /api/v1/webhooks/test`.  
Smoke Phase 8: lawyer overview insights → client next actions → `/admin/insights` generate brief → rematch and confirm `outcomeFit` in match payload.  
Smoke NBA: client primary CTA advances funnel (match → consent → book → escrow); dismiss hides for session; matter detail shows lead-scoped NBA; `nba.click` / `nba.dismiss` in analytics.  
Smoke Phase 0: signed-out `/lawyer` → `/login?next=`; login as client → `/client`; lawyer cannot open `/admin` (redirect home); non-admin `GET /api/v1/admin/analytics` → 403.
