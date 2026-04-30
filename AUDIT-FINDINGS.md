# Boltcall Audit — 2026-04-30

Scope: full 9-phase audit of dashboard / frontend / backend / integrations.
Findings flow: P0s fixed inline; P1/P2 collected here for fix-pass at end.
Plan: `C:\Users\Asus\.claude\plans\i-ahev-so-many-glimmering-honey.md`

---

## P0 — Broken (user-blocking, money-blocking, or security)

### [P0] `setup-launch` accepts arbitrary `userId`/`workspaceId` from request body — broken authorization
- **Files**: `netlify/functions/setup-launch.ts:34-69`
- **Repro**: function reads `{ workspaceId, userId }` from body and writes to `workspaces.setup_completed=true` and `business_profiles.updated_at` for any caller. There is no `Authorization` header check, no `supabase.auth.getUser(token)`, no membership check that the calling user actually owns this workspace. Any authenticated (or unauthenticated, with CORS `*`) request can mark anyone's setup as complete.
- **Recommended fix**: verify the bearer JWT, resolve `user.id`, then verify the user owns `workspaceId` (`workspaces.user_id === user.id` or membership in `workspace_members`). Reject otherwise.
- **Owner**: Claude (this audit)

### [P0] `invite-member` "remove" action trusts `requestedBy` from request body, not JWT — auth bypass
- **Files**: `netlify/functions/invite-member.ts:155-176`
- **Repro**: function verifies the bearer JWT at line 32-42, but the `remove` branch then reads `requestedBy` from the body (line 156) and uses *that* user_id to look up the role, ignoring the authenticated `authUser.id`. An authenticated user A can pass `requestedBy=<some admin's user_id>` and the role-check at line 166 will pass — A can then remove any member of any workspace. Same concern lurks in `accept` (line 122) which trusts `userId` from body without comparing to `authUser.id`.
- **Recommended fix**: in every branch, use `authUser.id` from the verified JWT, not `requestedBy`/`userId` from body. Validate workspace membership of `authUser.id` before any mutation.
- **Owner**: Claude

### [P0] `invite-member` "invite" action does not check the inviter belongs to the target workspace
- **Files**: `netlify/functions/invite-member.ts:49-91`
- **Repro**: JWT is verified, but the `workspaceId` and `invitedBy` come straight from the request body. Any authenticated Boltcall user can invite arbitrary email addresses to any workspaceId they can guess. The invitee receives a real Boltcall-branded invite email (line 97-116) — phishing-grade.
- **Recommended fix**: before insert/update, confirm `authUser.id` is a member with `owner|admin` role on `workspaceId`.
- **Owner**: Claude

### [P0] `setup-launch` returns `success: true` on DB failure — silent setup loss
- **Files**: `netlify/functions/setup-launch.ts:55-78`
- **Repro**: when `wsError` (line 55) or `bpError` (line 66) occurs the function logs and falls through to `200 / success: true`. The user sees "setup complete" even though `setup_completed` was never set. Next login they'll be sent back to `/setup` with no explanation, or worse, allowed into the dashboard with a half-broken state.
- **Recommended fix**: return 500 on either error; surface the error message to the client; don't double-update if the first write failed.
- **Owner**: Claude

## P1 — Partial / Stubbed (works but has gaps)

### [P1] `dashboard-stats` returns global stats unscoped to caller — cross-tenant data leak
- **Files**: `netlify/functions/dashboard-stats.ts:115-152, 180-209`
- **Repro**: function verifies the user's JWT, but `getSupabaseStats` then runs `count`-style queries against `callbacks`, `chats`, `leads`, `workspaces`, `daily_metrics` with NO `eq('user_id', authUser.id)` filter. It also reads Boltcall's org-wide Retell + Twilio API keys (`process.env.RETELL_API_KEY`, `TWILIO_ACCOUNT_SID`) and returns global call/SMS counts. Any authenticated user (including a free signup) can hit this endpoint and learn Boltcall's total leads, total workspaces, total daily call volume, and a list of all phone numbers.
- **Recommended fix**: scope every query to `authUser.id`. If the endpoint is meant to be admin-only, gate by an `is_admin` flag or email allowlist.
- **Owner**: Claude

### [P1] `create-checkout-session` accepts caller-supplied `userId`, `email`, `successUrl`, `cancelUrl` without auth
- **Files**: `netlify/functions/create-checkout-session.ts:36-77`
- **Repro**: no JWT check. `userId` comes from body and ends up in Stripe `metadata.userId`, which `stripe-webhook` then trusts to attribute the subscription. Spam vector: any IP can mint Stripe checkout sessions with arbitrary metadata. `successUrl` is also user-supplied — Stripe will redirect there post-payment, enabling open-redirect or phishing flows where the victim lands on attacker.com with their `session_id` after paying. Empty `userId` (line 66, 72) silently falls through and stripe-webhook then drops the subscription creation (`No userId in checkout session metadata` log only).
- **Recommended fix**: require + verify JWT; pull `userId` and `email` from `authUser`; validate `successUrl` / `cancelUrl` against an allowlist of `boltcall.org` paths or hard-code them server-side.
- **Owner**: Claude

### [P1] `retell-webhook` does not verify Retell signature
- **Files**: `netlify/functions/retell-webhook.ts:135-165`
- **Repro**: handler accepts any POST body and processes it. Retell sends `x-retell-signature` for HMAC verification but the handler never reads or checks it. An attacker who knows a `retell_agent_id` (visible to anyone who has called the user's Retell number) can POST a synthetic `call_ended` payload to this endpoint and trigger: missed-call SMS textbacks, fake leads inserted into `leads`, customer Zapier webhooks fired with synthetic data, lead enrollment in follow-up sequences.
- **Recommended fix**: read `RETELL_WEBHOOK_SECRET` env var, verify HMAC of `event.body` against `x-retell-signature`. Per Retell docs: `Retell.verifyWebhook(body, secret, signature)`.
- **Owner**: Claude

### [P1] `lead-webhook` Facebook branch does not verify `X-Hub-Signature-256`
- **Files**: `netlify/functions/lead-webhook.ts:273-298`
- **Repro**: when `body.object === 'page' && body.entry`, the handler processes a Facebook leadgen webhook payload. Facebook signs every webhook with `X-Hub-Signature-256: sha256=<hmac>` using the App Secret, but this branch never verifies it. An attacker who learned a real `page_id` (from `facebook_page_connections`, or by guessing) could submit synthetic leadgen payloads.
- **Recommended fix**: HMAC-SHA256 of raw `event.body` with `FB_APP_SECRET`, compare against `event.headers['x-hub-signature-256']`. Reject mismatches with 403.
- **Owner**: Claude

### [P1] `_shared/token-utils.getSupabase()` falls back to anon key — server functions degrade silently
- **Files**: `netlify/functions/_shared/token-utils.ts:3-7`
- **Repro**: shared helper used by `lead-webhook`, `retell-webhook`, and others. If `SUPABASE_SERVICE_KEY` is unset, falls back to `VITE_SUPABASE_ANON_KEY`. Anon-key writes are subject to RLS, so server-side code paths that should bypass RLS will silently fail (returning 0 rows updated) or, depending on policy laxness, succeed with weaker authorization than expected.
- **Recommended fix**: throw on missing service key in production. Make the fallback explicit (e.g., a `getAnonSupabase` helper) so it's never the default for write paths.
- **Owner**: Claude

### [P1] Token-deduction race condition in `_shared/token-utils.deductTokens`
- **Files**: `netlify/functions/_shared/token-utils.ts:54-115`
- **Repro**: read-modify-write on `token_balances` with no row lock. Two concurrent function invocations (e.g., a burst of 5 SMS sends) both read the same starting balance, both compute `new = old - cost`, both write — the second overwrites the first, so the second deduction is effectively free. Same pattern in `deductTokensBatch` (line 147).
- **Recommended fix**: use a Postgres function (`rpc('deduct_tokens', { ... })`) that does the read-modify-write inside a single transaction with `SELECT ... FOR UPDATE`, or use `update(...).select()` with optimistic concurrency (`gte('balance', cost)` returning 0 rows means another transaction won the race).
- **Owner**: Claude

### [P1] Stripe `handleInvoicePaid` reads `userId` from `invoice.subscription_details.metadata` which is stale post-2024-Stripe-API
- **Files**: `netlify/functions/stripe-webhook.ts:153-156`
- **Repro**: `invoice.subscription_details?.metadata?.userId` is read but Stripe API ≥ 2024-09 returns `subscription_details` only on certain Invoice types (recurring, paid). For one-off Checkout invoices or upgrade/proration invoices, this field can be absent — function returns silently (line 155), no invoice row created, customer doesn't see receipt.
- **Recommended fix**: fall back to looking up the subscription via `invoice.subscription` and reading `metadata.userId` from there; or store `userId` on the `subscriptions` row at creation time and look it up by `subscription_id`.
- **Owner**: Claude

## P2 — Polish (warnings, dead code, inconsistencies)

### [P2] ESLint: 967 errors / 33 warnings
- **Files**: scattered — dominated by `@typescript-eslint/no-explicit-any` (~700+) and `no-unused-vars` (~50)
- **Repro**: `npm run lint` exits with 967 errors. None block the build (TypeScript compiles cleanly).
- **Recommended fix**: triage to known-safe `any`s (Supabase generic `Json`, `metadata` blobs) → suppress at config level; fix the rest in a stand-alone PR.
- **Owner**: Claude (later)

### [P2] Test suite: 44 / 634 failing
- **Files**: at minimum `src/pages/dashboard/__tests__/LeadsPage.test.tsx:91` (UI changed, expectations stale), `src/pages/dashboard/__tests__/smoke.test.tsx` re: `WhatsappPage` (Supabase mock missing `removeChannel`)
- **Repro**: `npm run test:run` reports `Test Files 10 failed | 43 passed (53)` and `Tests 44 failed | 590 passed (634)`.
- **Recommended fix**: investigate per-file; most look like stale assertions vs. real regressions. Detailed list pending second test-run grep.
- **Owner**: Claude

### [P2] `lead-webhook` and `retell-webhook` use CORS `*` while accepting authenticated requests
- **Files**: `netlify/functions/lead-webhook.ts:33-37`, `netlify/functions/retell-webhook.ts:24-29`
- **Repro**: `Access-Control-Allow-Origin: *` is fine for genuine webhooks (server-to-server, no browser), but `lead-webhook` also accepts authenticated `Authorization: Bearer bc_…` API keys. A `*` CORS origin combined with a bearer API key in the request can leak the key in a browser context if a customer accidentally embeds the API call in a page. Low-likelihood but worth tightening.
- **Recommended fix**: split webhook (`*`) and authenticated (`Origin allowlist`) paths, or document that API keys must never be used from a browser.
- **Owner**: Claude (later)

---

## Phase progress

- [ ] Phase 1 — Baseline health
- [ ] Phase 2 — Critical funnel E2E
- [ ] Phase 3 — Backend functions (67)
- [ ] Phase 4 — Frontend dashboard (40+)
- [ ] Phase 5 — Integrations (12)
- [ ] Phase 6 — Data layer
- [ ] Phase 7 — Operational
- [ ] Phase 8 — Security
- [ ] Phase 9 — Triage

---

## Finding template

```
### [P?] <one-line title>
- **Files**: path/to/file.ts:42-55
- **Repro**: how I verified
- **Recommended fix**: …
- **Owner**: Claude / Noam / external
```
