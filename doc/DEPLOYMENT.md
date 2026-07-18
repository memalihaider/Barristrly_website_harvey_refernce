# Barristrly deployment guide

Deploy the Next.js app (`apps/web`) with Supabase as the backend. Marketing + portals + API all ship from this app.

**Recommended:** Vercel for the web app + managed Supabase.  
**Alternative:** VPS (Node + PM2 + Nginx) when you need a dedicated host or mediasoup SFU later.

---

## Prerequisites (both paths)

1. **Supabase project** with schema applied (live tables + migrations under `supabase/migrations/`, especially live-compatible ones `20260718000005+`).
2. **Env vars** (from Supabase → Project Settings → API):

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL (`https://…`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Publishable / anon key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Alias of publishable key if used |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (prod) | Server-only — admin KPIs, analytics, docs |
| `GEMINI_API_KEY` | Optional | Live AI; stubs if missing |
| `STRIPE_*` | Optional | Escrow stays stub without Stripe |

3. **Bootstrap admin** after first login:

```sql
update public.users
set role = 'platform_admin'
where email = 'your-admin@example.com';
```

4. **Auth redirect URLs** in Supabase Auth → URL configuration:
   - Site URL = your production URL
   - Redirect allow list: `https://YOUR_DOMAIN/**`, `http://localhost:3000/**`

---

## A. Deploy on Vercel (recommended)

### 1. Push repo to GitHub/GitLab

### 2. Import project in Vercel

- [vercel.com/new](https://vercel.com/new) → import this repo

**Preferred settings (Root Directory = `apps/web`):**

| Setting | Value |
| --- | --- |
| Root Directory | `apps/web` |
| Framework | Next.js |
| Install Command | `cd ../.. && npm ci` |
| Build Command | `cd ../.. && npm run build -w @barristrly/web` |
| Output | leave default (Next.js) |

You can ignore root `vercel.json` when using Root Directory `apps/web`, or leave Root Directory empty and use:

| Setting | Value |
| --- | --- |
| Root Directory | `.` (repo root) |
| Install | `npm ci` |
| Build | `npm run build -w @barristrly/web` |

In that case also set **Output Directory** empty and ensure Framework Preset is Next.js; Vercel should pick up `apps/web` via the workspace build. If detection fails, use the `apps/web` Root Directory approach above.

### 3. Environment variables

In Vercel → Project → Settings → Environment Variables, add all required vars for **Production** (and Preview if desired).  
Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser (do not prefix with `NEXT_PUBLIC_`).

### 4. Deploy

- Push to `main` or click **Deploy**
- Confirm `https://YOUR_PROJECT.vercel.app/api/v1/health` returns OK

### 5. Custom domain

Vercel → Domains → add domain → point DNS as instructed.  
Update `NEXT_PUBLIC_APP_URL` and Supabase Auth URLs to match.

### 6. Post-deploy smoke

1. `/login` → register client + lawyer  
2. Promote admin (SQL above) → `/admin`  
3. Approve lawyer → client intake → matches → book → escrow  
4. `/admin/insights` KPIs load (needs service role)

---

## B. Deploy on a VPS (Ubuntu 22.04+)

Use this when you want a single VM (or later mediasoup on the same host).

### 1. Server prep

```bash
sudo apt update && sudo apt install -y nginx git curl
# Node 22 via NodeSource or nvm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
```

### 2. Clone & env

```bash
sudo mkdir -p /var/www/barristrly
sudo chown "$USER":"$USER" /var/www/barristrly
cd /var/www/barristrly
git clone YOUR_REPO_URL .
cp .env.example apps/web/.env.local
nano apps/web/.env.local   # fill production values; NEXT_PUBLIC_APP_URL=https://your.domain
```

### 3. Build

```bash
cd /var/www/barristrly
npm ci
npm run build -w @barristrly/web
```

### 4. Process manager (PM2)

```bash
# From repo root — Next start for the web workspace
pm2 start npm --name barristrly-web -- run start -w @barristrly/web
pm2 save
pm2 startup   # follow the printed systemd command
```

App listens on `http://127.0.0.1:3000` by default.

### 5. Nginx reverse proxy + TLS

`/etc/nginx/sites-available/barristrly`:

```nginx
server {
  listen 80;
  server_name your.domain;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/barristrly /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your.domain
```

### 6. Updates

```bash
cd /var/www/barristrly
git pull
npm ci
npm run build -w @barristrly/web
pm2 restart barristrly-web
```

### 7. Optional Docker

See [`infrastructure/docker/docker-compose.yml`](../infrastructure/docker/docker-compose.yml) for local stack experiments. Production on VPS above is simpler for this Next-only app until you add mediasoup workers.

---

## Hybrid: Vercel (web) + VPS (workers)

| Piece | Where |
| --- | --- |
| Next.js UI + API routes | Vercel |
| Supabase DB / Auth / Storage | Supabase Cloud |
| Future mediasoup SFU / Redis jobs | VPS |

Point `NEXT_PUBLIC_APP_URL` at Vercel. Keep service role only on Vercel server env (and on VPS if you run trusted workers there).

---

## Local test script

From repo root:

```bash
chmod +x scripts/run-test.sh
./scripts/run-test.sh          # interactive dev server
./scripts/run-test.sh --smoke  # build + health check + exit
./scripts/run-test.sh --build  # production mode locally
```

Or: `npm run test:app` / `npm run test:smoke`

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Admin 403 | Set `users.role = platform_admin`; ensure `SUPABASE_SERVICE_ROLE_KEY` on server |
| Portal redirect loop | Supabase Auth cookies / URL config; clear cookies |
| Build fails on Vercel | Use root `npm ci` + workspace build; Node 22 |
| Health 503 / empty data | Check Supabase URL + publishable key in runtime env |
