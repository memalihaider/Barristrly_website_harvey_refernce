#!/usr/bin/env bash
set -euo pipefail
echo "Barristrly Phase 0 bootstrap"
echo "1. cp .env.example .env.local  # fill Firebase service account / Stripe / Gemini"
echo "2. npm install"
echo "3. Deploy Firestore/Storage rules: firebase deploy --only firestore:rules,storage"
echo "4. npm run dev"
echo "5. Health: curl http://localhost:3000/api/v1/health"
