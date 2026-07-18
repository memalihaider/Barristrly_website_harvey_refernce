# Barristrly

AI-powered legal services marketplace + LegalOS.

## Repository layout

```
barristrly/
├── apps/
│   ├── web/          # Next.js SaaS + marketing (primary)
│   └── mobile/       # React Native (Phase 7)
├── packages/
│   └── ui/           # Shared design tokens
├── supabase/         # Migrations & config
├── infrastructure/   # Docker compose
├── doc/              # Architecture & product docs
└── package.json      # npm workspaces root
```

`apps/web/src` follows feature-first structure:

- `app/` — routes (marketing, auth, portal, api)
- `components/` — shared UI
- `features/` — domain logic (marketplace, payments, meetings, …)
- `lib/` — supabase, auth, ontology, jobs, observability

## Develop

```bash
cp .env.example apps/web/.env.local   # fill Supabase keys
npm install
npm run test:app                      # recommended: checks env + typecheck + dev server
# or: npm run dev
```

Smoke (CI-like): `npm run test:smoke`  
Production-like locally: `npm run test:prod`

Portals: `/client`, `/lawyer`, `/admin`  
API: `/api/v1/health`

## Deploy

See **[doc/DEPLOYMENT.md](doc/DEPLOYMENT.md)** for Vercel and VPS (Nginx + PM2) steps.

## Docs

See [doc/IMPLEMENTATION_ROADMAP.md](doc/IMPLEMENTATION_ROADMAP.md) (marketplace-first) and [doc/PLATFORM_STATUS.md](doc/PLATFORM_STATUS.md).
