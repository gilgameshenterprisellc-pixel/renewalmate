@AGENTS.md

# RenewalMate — Project Context

> Bootstrapped sister project to SocialMate, under Gilgamesh Enterprise LLC.
> Repo: github.com/gilgameshenterprisellc-pixel/renewalmate
> Live: renewalmate.com (Vercel, free tier)

---

## What RenewalMate Is

A "Finance OS" — subscription/bill tracker that's expanding into a full personal finance home base: recurring + one-time expense tracking, budgets, net worth, and savings goals. Green rebrand (`#1e7a4a` primary, `#166038` hover, `#1a2e22` dark text, `#f8faf9` background).

**Core principle:** "If it costs us, it costs them." Every feature that hits a paid external API gets gated behind a paid tier. Everything else is free, forever.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React + Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Email | Resend (`reminders@renewalmate.com`) |
| Cron | Vercel Cron (`vercel.json`) |
| Push | web-push (VAPID) + service worker |
| Deployment | Vercel (auto-deploy from GitHub) |

---

## Two-Phase Build Plan

**Phase 1 — Everything free to users.** ✅ COMPLETE (merged PR #10, June 13, 2026).
**Phase 2 — Things that cost money, gated behind a paid tier ("RenewalMate Plus").** ✅ MERGED (PR #11 June 2026, copy accuracy fix PR #12). Verify migrations ran + Stripe/Plaid/Gemini env vars set in Vercel before announcing Plus.

---

## Current State (July 7, 2026)

- **Merged:** PR #10 (Finance OS Phase 1), PR #11 (RenewalMate Plus — Stripe tier, Plaid bank sync, Gemini AI insights), PR #12 ("free forever" copy corrected now that Plus exists).
- **June 19 waitlist data-loss fix** — `app/api/waitlist/route.ts` was logging + returning success without saving; now emails `renewalmate.updates@gmail.com` via Resend. Landed as direct commit `609b907`.
- **⚠️ TWO LOCAL CLONES, TWO REMOTES.** `C:/Users/jbost/renewalmate` pushes to `renewalmateupdates/renewalmate`; `C:/Users/jbost/renewalmate-backend` pushes to `gilgameshenterprisellc-pixel/renewalmate`. As of July 7 both remotes are in sync at `609b907`, but the `C:/Users/jbost/renewalmate` clone has a stale unresolved merge conflict in its index (`package.json` + `package-lock.json` marked UU) — resolve or `git checkout -- .` / re-clone before working there. Confirm which repo Vercel actually deploys renewalmate.com from before pushing, and keep both remotes in sync (or retire one) to avoid split-brain history.
- **Unverified:** whether `20260614000001_renewalmate_plus.sql` + `20260614000002_ai_insights.sql` were run in Supabase, and whether the Phase 2 env vars are set in Vercel (routes degrade to 503 without them).

---

## Phase 1 — Shipped (June 13, 2026, PR #10)

- **Trackables generalization** — `subscriptions` table now supports `item_type` (subscription/bill/license/one_time), `is_trial`/`trial_ends_at`, `subscription_price_history` table, and `one_time` billing cycle (no renewal date required)
- **Shared `AppNav`** component across dashboard, budget, net worth, goals, import, settings
- **Budget page** (`/budget`) — category monthly caps + spend tracking
- **Net Worth page** (`/net-worth`) — assets/debts CRUD with running total
- **Goals page** (`/goals`) — savings goals with target amount/date
- **CSV Import** (`/import`) — bulk-import trackables
- **Settings page** (`/settings`):
  - Weekly digest email toggle
  - Push notification toggle (PWA)
  - Full JSON data export (`/api/account/export`)
  - **Immediate self-serve account deletion** — no approval workflow, no waiting period. "Full power to the people." (`/api/account/delete`)
- **Privacy commitment page** (`/privacy`) — privacy is a core differentiator, not boilerplate
- **Cancellation directory** (`/cancel`) — help users actually cancel subscriptions
- **Wall of Love** (`/wall-of-love`) — testimonial page
- **Weekly digest email cron** — `/api/cron/weekly-digest`, Mondays 1pm UTC, Resend, opt-out via `user_settings.weekly_digest_enabled`
- **PWA push notifications** — `public/sw.js`, `hooks/usePushNotifications.ts`, `/api/notifications/{subscribe,unsubscribe,send}`. Wired as a best-effort, non-fatal push into the existing `renewal-reminders` cron (alongside the email). Requires VAPID env vars (see below).

### Post-merge setup (done June 13, 2026)
- Migration `supabase/migrations/20260613000003_finance_os_phase1.sql` run successfully in Supabase ✅
- PR #10 merged to main ✅
- VAPID env vars being added to Vercel + redeploying (in progress as of June 13 night)

### Schema notes
- `push_subscriptions.auth_key` (not `auth`) — matches this repo's migration, mapped back to Push API's `keys.auth` at send time
- `user_settings` table: `user_id` PK, `weekly_digest_enabled boolean default true`

---

## Phase 2 — RenewalMate Plus (built June 14, 2026)

**Trigger:** Joshua's call on the Plaid/privacy tension — *"I want it integrated, but if its going to cost me then we need to charge for it and change terms."* So: bank sync is built, gated behind a paid tier, and the privacy page + blog copy now describe it as an optional paid opt-in instead of "never, ever."

### RenewalMate Plus — what's included
- **Plaid bank sync** — connect a bank account, auto-detect recurring charges and create/update trackables from them
- **Gemini AI Insights** — AI-generated spend insights (overlapping subscriptions, expensive categories, trial/renewal warnings, monthly-vs-yearly suggestions)
- Free plan stays fully featured for manual tracking — Plus is additive, not a paywall on core features

### Stripe infrastructure
- `lib/stripe.ts` — **lazy singleton pattern**: `getStripe()` with module-level cache, falls back to `'sk_test_placeholder'` if `STRIPE_SECRET_KEY` unset. **Never instantiate Stripe (or any SDK client reading env vars) at module scope** — breaks `next build`'s "Collecting page data" phase since env vars aren't present at build time. Same lazy pattern used for `lib/plaid.ts` (`getPlaidClient()`).
- `/api/stripe/checkout` (POST) — creates Checkout session for upgrade to Plus, `metadata.user_id` set for webhook
- `/api/stripe/portal` (POST) — Stripe billing portal for managing/cancelling subscription
- `/api/stripe/webhook` — handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; upserts `user_settings.plan` (`'free'`/`'plus'`), `stripe_customer_id`, `stripe_subscription_id`, and clears `plaid_enabled` on downgrade
- All Stripe/Plaid/Gemini routes use `export const dynamic = 'force-dynamic'`

### Plaid bank sync
- `lib/plaid.ts` — `getPlaidClient()` lazy singleton, `PLAID_ENV` (`sandbox`/`development`/`production`)
- `/api/plaid/link-token` (POST) — creates Link token, 403 if `plan !== 'plus'`, 503 if Plaid env vars unset
- `/api/plaid/exchange` (POST) — exchanges `public_token` for `access_token`, stores in `plaid_items`, sets `user_settings.plaid_enabled = true`
- `/api/plaid/sync` (POST) — `transactions/sync` with cursor pagination per item; groups expense transactions by `merchant|rounded_amount`, requires ≥2 occurrences, classifies cadence (weekly/monthly/yearly) from days-between-last-two, creates or updates matching `subscriptions` rows (`plaid_transaction_id` for traceability)
- `/api/plaid/disconnect` (POST) — calls `itemRemove` per item (non-fatal on failure), deletes `plaid_items` rows, sets `plaid_enabled = false`
- Settings UI (`/settings`) — "RenewalMate Plus" card: upgrade/manage billing button, plus a "Bank sync" section (Connect / Sync now / Disconnect) using `react-plaid-link`'s `usePlaidLink`

### Gemini AI Insights
- `lib/gemini.ts` — `generateInsights(prompt)`, plain `fetch` to Gemini REST API (`gemini-2.5-flash`, `GEMINI_API_KEY`), no SDK dependency
- `/api/insights` — GET returns cached `ai_insights` row; POST is gated to `plan === 'plus'`, **rate-limited to once per 24h** (cost control), builds a prompt from the user's trackables, calls Gemini, upserts result to `ai_insights` (one row per user)
- Dashboard (`/dashboard`) — "AI Insights" card: Plus users see cached insight + "Generate/Refresh insights" button; free users see an upgrade CTA linking to `/settings`

### Schema additions (migrations, NOT YET RUN — paste in chat to confirm before running)
- `supabase/migrations/20260614000001_renewalmate_plus.sql` — adds `plan`, `stripe_customer_id`, `stripe_subscription_id`, `plaid_enabled` to `user_settings`; creates `plaid_items` table (RLS); adds `plaid_transaction_id` to `subscriptions`
- `supabase/migrations/20260614000002_ai_insights.sql` — creates `ai_insights` table (`user_id` PK, `content`, `generated_at`, RLS select-only — admin client writes via service role)

### Privacy/copy changes (Task #20, done)
- `/privacy` — rewrote principles: bank sync is now described as Plus-only, opt-in, disconnectable, and Plaid-powered (was "no bank connection, ever")
- `lib/blog-posts.ts` (`track-bills-without-bank-access` post) — added a closing section explaining RenewalMate Plus's optional Plaid sync, while keeping the free/manual-first framing intact

---

## Cron Jobs (`vercel.json`)

| Path | Schedule | Purpose |
|---|---|---|
| `/api/cron/renewal-reminders` | `0 13 * * *` (daily 1pm UTC) | Email + push reminder for renewals in next 3 days |
| `/api/cron/weekly-digest` | `0 13 * * 1` (Mondays 1pm UTC) | Weekly summary email |

---

## Known Conventions / Gotchas

- Cron auth: `Authorization: Bearer ${CRON_SECRET}` header check, 401/403 on mismatch
- Supabase server client: `await createClient()` from `@/lib/supabase/server` (cookie-based, `@supabase/ssr`)
- Supabase admin client: `createAdminClient()` from `@/lib/supabase/admin` (service role, no session persistence) — use in cron jobs and routes needing to bypass RLS for the requesting user's own data
- Idempotency: `reminder_sent_for_date` column comparison prevents duplicate renewal emails
- `tsc --noEmit -p tsconfig.json` and `next build` both must pass clean before considering a feature done

---

## Env Vars Needed

- `RESEND_API_KEY` — transactional email
- `CRON_SECRET` — cron + internal API auth
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` — push notifications (added June 13, 2026)
- Standard Supabase vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)

### Phase 2 — RenewalMate Plus (added June 14, 2026, NOT YET SET in Vercel)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe API + webhook signature verification
- `STRIPE_PLUS_PRICE_ID` — Price ID for the RenewalMate Plus subscription (create in Stripe before going live)
- `NEXT_PUBLIC_SITE_URL` — used for Stripe checkout success/cancel redirect URLs
- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` (`sandbox`/`development`/`production`) — Plaid bank sync
- `GEMINI_API_KEY` — Gemini AI Insights (`gemini-2.5-flash` via REST, no SDK)

All Phase 2 routes degrade gracefully (503) if their env vars aren't set, so the app builds and runs fine before these are configured.

---

## Coding Rules

- Mirror SocialMate's discipline: one branch + one PR per feature batch, commit frequently, always open a PR after pushing with a direct link
- Paste SQL inline in chat when migrations are needed, never just link the file
- Don't touch RLS policies without confirming
- Any new feature with external API costs needs a cost model before building — Phase 2 features especially
