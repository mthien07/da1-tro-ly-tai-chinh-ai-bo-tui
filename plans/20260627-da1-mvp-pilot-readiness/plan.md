---
title: "DA1 MVP Pilot Readiness"
description: "Finish the minimal backend, mobile, and docs work needed for a local pilot-ready MVP."
status: in-progress
priority: P1
effort: 8h
branch: main
tags: [feature, backend, mobile, api, docs]
created: 2026-06-27
---

# DA1 MVP Pilot Readiness

## Findings
- `backend/run_schema.py` now reads `SUPABASE_DB_URL`; no plaintext database connection details remain in that script.
- Backend finance endpoints now require a Supabase Bearer token and derive `user_id` from the authenticated principal.
- Mobile no longer falls back to a shared demo UUID; it fails closed when there is no Supabase session.
- `reports/summary` supports `date_from` and `date_to`, so dashboard monthly totals can match the label.
- `mobile/src/utils/supabase.ts` no longer crashes at import time when Expo Supabase env vars are missing.
- Validation is still mostly smoke-level; full automated auth/math/parser coverage is a follow-up.

## Phases
1. Backend cleanup — 3h
   - Status: done
   - Move settings and Supabase init behind functions/dependencies; add `/health`; standardize success/error JSON.
   - Keep local OCR/AI mock fallback, but make missing config explicit and non-fatal.
2. Reports and transaction API — 2h
   - Status: done
   - Implement `GET /api/v1/transactions` and `GET /api/v1/reports/summary` with authenticated user context, date range, totals, and category breakdown.
   - Add minimal Pydantic request/response models so mobile can depend on stable shapes.
3. Mobile integration — 2h
   - Status: done
   - Move the live screens into `mobile/app/` and retire unused placeholder routes after confirming they are dead.
   - Expand `mobile/src/utils/api.ts` for report/transaction reads, server error parsing, and retry-safe failures.
   - Remove mock UUID fallback; keep Supabase auth client, but use backend endpoints for OCR, parse, and report reads needed by pilot.
4. Docs and verification — 1h
   - Status: done
   - Update `README.md` and `mobile/README.md` with install/run steps and env variable names only.
   - Document exact verification commands and expected smoke results.

## Target Files
- Backend: `/Users/ht/Desktop/Thi/repos/da1-tro-ly-tai-chinh-ai-bo-tui/backend/main.py`, `/backend/app/core/config.py`, `/backend/app/core/db.py`, `/backend/app/api/endpoints/ocr.py`, `/backend/app/api/endpoints/transactions.py`, `/backend/app/api/endpoints/reports.py`
- Mobile: `/Users/ht/Desktop/Thi/repos/da1-tro-ly-tai-chinh-ai-bo-tui/mobile/app/*.tsx`, `/mobile/src/utils/api.ts`, `/mobile/src/utils/supabase.ts`
- Docs: `/Users/ht/Desktop/Thi/repos/da1-tro-ly-tai-chinh-ai-bo-tui/README.md`, `/mobile/README.md`
- Optional if missing: `/Users/ht/Desktop/Thi/repos/da1-tro-ly-tai-chinh-ai-bo-tui/backend/requirements.txt` or `/backend/pyproject.toml`

## Verification Commands
- `python3 -m compileall backend`
- `cd backend && python3 -m uvicorn main:app --reload`
- `curl http://127.0.0.1:8000/health`
- `curl -H "Authorization: Bearer <supabase_access_token>" "http://127.0.0.1:8000/api/v1/reports/summary?date_from=2026-06-01&date_to=2026-06-30"`
- `cd mobile && npx tsc --noEmit`
- `cd mobile && npm run lint`
- `cd mobile && npx expo start`

## Done When
- Backend starts without requiring `.env` or credential JSON at import time.
- Reports and transaction read endpoints return deterministic JSON usable by mobile.
- `mobile/app/` is the single active route tree for camera, review, ledger, and dashboard flow.
- Docs cover local setup, run order, env names, and pilot smoke checks.

## Verification Results
- `python3 -m compileall -q backend`: passed.
- `cd mobile && npx tsc --noEmit`: passed.
- `cd mobile && npm run lint`: passed after Expo generated ESLint config.
- `GET /health`: 200 OK.
- `GET /api/v1/reports/summary` without token: 401 Unauthorized.
- `POST /api/v1/transactions/parse` without token: 401 Unauthorized.
- `GET /api/v1/transactions` without token: 401 Unauthorized.
- `GET /api/v1/reports/summary` with invalid token: 401 Unauthorized.
- Final post-fix checks: `python3 -m compileall -q backend`, `cd mobile && npx tsc --noEmit`, and `cd mobile && npm run lint` passed.
- Final post-fix smoke on port `8014`: `/health` returned 200; unauthenticated/invalid-token finance requests returned 401.
- `POST /api/v1/ocr/extract`: 200 OK with Google Vision.
- Tester report: `plans/20260627-da1-mvp-pilot-readiness/reports/tester-260627-2204-da1-mvp-validation.md`, all requested checks passed.
- Reviewer blockers addressed after review: `run_schema.py` now reads `SUPABASE_DB_URL`; finance endpoints now require Bearer auth and derive `user_id` from Supabase Auth instead of request input.

## Review Status
- 2026-06-27 code review found two blockers; both were addressed in the follow-up patch.
- Remaining implementation gaps:
  - `/health` is still a configuration/status endpoint, not a full downstream dependency probe.
  - Validation coverage is still smoke-heavy; unit/integration tests should be added before wider rollout.

## Risks
- Live OCR/AI still depends on external keys; pilot flow must remain usable with explicit mock fallback.
- Monitoring can still be misleading because `/health` reports configured flags, not real downstream connectivity or key validity.

## Next Steps
1. Rotate the database password that previously appeared in `backend/run_schema.py`.
2. Add a real pilot sign-in/onboarding screen if testers do not already have Supabase sessions.
3. Replace smoke-only validation with automated backend/mobile tests that cover auth, summary correctness, parser edge cases, and no-env startup behavior.
4. Upgrade `google.generativeai` to the newer `google.genai` SDK.

## Unresolved Questions
- None.
