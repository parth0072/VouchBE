# Vouch — Backend

API for Vouch, a two-sided marketplace connecting clients (brands) with creators (influencers) for sponsored content: clients post briefs or send direct offers, creators bid or negotiate, both sides consent to usage-rights/live-duration terms before escrow funds, then draft → approve → live → payout.

Implements every endpoint in [`Vouch - Backend Requirements.md`](../Vouch%20-%20Backend%20Requirements.md) §3, plus a handful of endpoints and schema fields added along the way to close gaps found between that spec and the design files (see [API.md](API.md) for the full list).

## Stack

- Node 18+, TypeScript, Express
- Kysely + `mysql2` (MySQL) — see below for why this isn't Prisma
- JWT auth (access + refresh)
- Stripe (manual-capture escrow, Connect payouts) and OAuth (social account linking) — real SDK calls, gated behind env vars; return `501` until configured rather than faking success
- Pre-signed S3 URLs for uploads (portfolio images, brief reference images, drafts) — never proxied through the API

**Why not Prisma:** the original implementation used Prisma, and it worked everywhere it was tested — until deploying to this project's actual cPanel/CloudLinux host, where Prisma's native Rust query engine reliably crashed or hung (wrong binary target, then a resource-limited environment that couldn't sustain the engine's own thread pool, then a Tokio runtime panic even with the correct binary and a live DB connection already confirmed working). A sibling app on the same account, using `mysql2` directly, ran fine the whole time — real evidence the account can run Node + MySQL reliably, just not Prisma's native engine specifically. The whole data layer was rewritten onto Kysely (a type-safe SQL query builder with no native dependency) on top of `mysql2`, keeping the external API contract — every endpoint, request/response shape — identical throughout.

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL at minimum to boot; see below for the rest
mysql -u root -p vouch < db/schema.sql   # creates all tables (first time only)
npm run dev             # http://localhost:4000
```

Other scripts: `npm run build` (compile to `dist/`), `npm start` (run the compiled build), `npm run typecheck`.

`.env.example` documents every variable, including which ones are optional (Stripe, OAuth per-platform credentials, the internal cron secret) versus required just to boot (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).

## API docs

- **Live Swagger UI**: https://parth0072.github.io/VouchBE/
- **Prose reference** (same coverage, with explanations of every gap found vs. the spec): [API.md](API.md)
- Source of truth for both: [`docs/openapi.json`](docs/openapi.json) (OpenAPI 3.0.3) and [`db/types.ts`](src/db/types.ts) (the actual Kysely schema)

## Project structure

```
src/
  app.ts, index.ts        Express app + entry point
  config/env.ts            zod-validated environment config
  db/                      Kysely instance (index.ts) + Database type definitions (types.ts)
  lib/                     id generation, jwt, stripe, error types, snake_case response mapping
  middleware/               auth (JWT bearer + role guard), error handler, internal-secret guard
  modules/
    auth/                  signup, login, refresh, role switch, logout
    onboarding/            social account OAuth linking, creator profile, portfolio
    briefs/                post/list/edit/cancel briefs
    bids/                  bid CRUD + accept
    creators/              directory search + public profile
    offers/                direct offers, counters, accept/decline
    deals/                 shared Deal state machine + get/list/cancel
    agreement/             usage-rights terms + the creator-consent gate
    payments/              escrow fund/mark-live/payout-release, payment & payout methods, transactions
    drafts/                submit/approve/request-changes
    messaging/             threads + messages
    notifications/         notification feed + push token registration
    reviews/                post-completion reviews, recomputes creator rating
    settings/               /me
db/schema.sql              full DDL — run once against a fresh database; db/types.ts is the live source of truth
docs/                      openapi.json + Swagger UI (served via GitHub Pages)
```

## Implementation notes worth knowing

- **`Deal.status` only ever changes through `transitionDeal()`** in `modules/deals/deal.state.ts` — a single state machine enforcing the transitions in the spec's §2.4, never a scattered `status = X` write.
- **Nothing about payments or verification is faked.** `is_verified` is computed on read from `SocialAccount.verified`, never stored. Escrow funding calls a real Stripe `PaymentIntent` before any DB write.
- **Response bodies are `snake_case`**, converted generically from the app's internal camelCase via `lib/caseConvert.ts`, to match the wire format documented in the original spec.
- **MySQL has no `RETURNING`** — every write in this codebase is a write followed by a read, not one call the way Prisma made it look.
- **IDs are generated in application code** (`lib/id.ts`, `crypto.randomUUID()`), not by the database — no table has a DB-side default on its `id` column.
