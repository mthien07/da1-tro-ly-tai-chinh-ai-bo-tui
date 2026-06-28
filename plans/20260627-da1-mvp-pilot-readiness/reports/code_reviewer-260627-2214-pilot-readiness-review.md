## Code Review Summary

### Scope
- Files reviewed: `README.md`, `.gitignore`, `backend/main.py`, `backend/app/**`, `backend/run_schema.py`, `backend/schema.sql`, `backend/supabase/migrations/20260624000000_init.sql`, `backend/test_api.py`, `mobile/app/**`, `mobile/src/app/**`, `mobile/src/context/AuthContext.tsx`, `mobile/src/utils/{api,supabase}.ts`, `mobile/{README.md,package.json,tsconfig.json,app.json}`, `plans/20260627-da1-mvp-pilot-readiness/{plan.md,reports/tester-260627-2204-da1-mvp-validation.md}`
- Lines of code analyzed: ~2001
- Review focus: changed/untracked MVP implementation under `backend/`, `mobile/`, `README.md`, `.gitignore`, `plans/`
- Updated plans: `plans/20260627-da1-mvp-pilot-readiness/plan.md`

### Overall Assessment
Build checks are green, but the MVP is not pilot-ready. Two issues block that label now: an exposed database password in source control scope and no real data isolation between users. There are also correctness gaps in summary reporting and major test coverage holes.

### Critical Issues
- Plaintext Supabase database credentials are checked into an implementation file. `backend/run_schema.py:4-13` hardcodes the database password, host, user, and DB name, then uses them to run schema SQL. This is direct secret exposure and an immediate database-compromise risk if the file is ever shared or committed. This blocks pilot-ready.
- The API trusts caller-controlled `user_id` for both reads and writes, and the mobile app falls back to one shared demo UUID when no session exists. `backend/app/api/endpoints/reports.py:33-50`, `backend/app/api/endpoints/transactions.py:22-27`, `backend/app/api/endpoints/transactions.py:108-155`, `backend/app/api/endpoints/transactions.py:171-189`, `backend/app/core/db.py:12-32`, `mobile/src/utils/api.ts:3`, `mobile/src/app/index.tsx:15-19`, `mobile/src/app/ledger.tsx:16-20`, `mobile/src/app/review.tsx:24-31`. Any client that can hit the API can request another user’s ledger by UUID; users without auth all share the same dataset. The tester report also shows live Supabase reads/inserts succeeded without any user token: `plans/20260627-da1-mvp-pilot-readiness/reports/tester-260627-2204-da1-mvp-validation.md:21-24`. This blocks pilot-ready.

### High Priority Findings
- Dashboard totals are mislabeled and will drift as data grows. The UI says "Tổng chi tiêu tháng này" in `mobile/src/app/index.tsx:49-55`, but `fetchReportSummary` sends only `user_id` in `mobile/src/utils/api.ts:122-123`, and the backend summary has no `from`/`to` filter in `backend/app/api/endpoints/reports.py:33-65`. It also caps the dataset at 500 rows before computing totals in `backend/app/api/endpoints/reports.py:47-56`, so the reported balance is not even full-history once the table grows past that limit.
- The mobile app can crash at startup when Supabase env vars are missing. `mobile/src/utils/supabase.ts:5-15` calls `createClient` at import time with `''` defaults. Local verification with `node -e "createClient('', '')"` returned `supabaseUrl is required.`. This is a brittle boot path and contradicts the plan’s stated goal of predictable setup behavior.

### Medium Priority Improvements
- `/health` reports config presence, not real service health. `backend/main.py:33-41` relies on `settings.has_*`, and `backend/app/core/config.py:26-47` only checks for non-placeholder values. The tester report showed `gemini=true` while parse still fell back after a Gemini failure: `plans/20260627-da1-mvp-pilot-readiness/reports/tester-260627-2204-da1-mvp-validation.md:21-24`. Ops can get a false-green signal.
- The fallback parser is too naive for production fallback use. `_parse_amount` returns the max numeric token in `backend/app/api/endpoints/transactions.py:28-45`, so strings like `"Cafe 50k ma don 123456"` become `123456` and `"Tong 55.000 MST 3901234567"` becomes `3901234567`. Local reproduction matched both cases. If Gemini is unavailable, amounts can be wildly wrong.

### Low Priority Suggestions
- `mobile/README.md:1-77` still carries large chunks of Expo starter guidance (`reset-project`, generic template language) instead of DA1-only pilot instructions. That is doc drift, not a blocker.
- `mobile/src/app/explore.tsx:1-180` is still unused Expo starter code. Not harmful, but it adds noise and makes the route-tree cleanup claim in the plan inaccurate.

### Positive Observations
- Backend no longer instantiates the Supabase client at module import; `backend/app/core/db.py:12-32` moved creation behind functions.
- `.gitignore` now covers `.env*`, `venv/`, `__pycache__/`, and credential JSON patterns.
- Fresh verification passed for `python3 -m compileall -q backend`, `cd mobile && npx tsc --noEmit`, and `cd mobile && npm run lint`.

### Recommended Actions
1. Remove `backend/run_schema.py` from the MVP path, rotate the exposed DB password, and use Supabase migrations only.
2. Add real auth on backend and mobile, derive `user_id` server-side from the authenticated principal, and delete `DEMO_USER_ID`.
3. Add `from`/`to` filters plus deterministic aggregation semantics for summary endpoints; align dashboard copy with the actual queried period.
4. Guard `mobile/src/utils/supabase.ts` so missing env vars fail closed with an explicit app-state message instead of an import-time crash.
5. Replace the current smoke script with automated tests covering auth/data isolation, fallback parser edge cases, summary math, and no-env startup.

### Metrics
- Type Coverage: not measured
- Test Coverage: not measured
- Linting Issues: 0 from `npm run lint`; 0 TypeScript errors from `npx tsc --noEmit`; backend compile passed via `python3 -m compileall -q backend`

### Unresolved Questions
- None
