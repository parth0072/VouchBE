# API Call Flows

[API.md](API.md) documents every endpoint in isolation. This doc is the complement: **for a given screen or user action, which endpoint(s) do you call, in what order, and what unlocks what.** Cross-reference endpoint details (request/response shapes, error codes) in API.md — this file only covers sequencing.

All endpoints below are relative to the base URL in API.md's Conventions section. 🔒 = needs `Authorization: Bearer <access_token>`.

## 1. Auth & role — do this before anything else

```
POST /auth/signup  { email, password }
  -> { access_token, refresh_token }

POST /auth/role 🔒  { role: "client" | "creator" }
  -> creates client_profiles/creator_profiles row on first switch, sets active_role
```

**Call `POST /auth/role` immediately after signup, every time — even to just confirm the role the user picked on the signup screen.** `active_role` is set to `"client"` at signup as a non-null placeholder only; the actual profile row (`client_profiles` or `creator_profiles`) does **not** exist until `/auth/role` creates it. Any write that depends on that row — most importantly `POST /briefs` — returns `400` ("A required related record doesn't exist yet...") if you skip this step. This is the #1 integration gotcha in this API.

One account can hold both roles (`has_client_profile` and `has_creator_profile` are independent booleans on `GET /me`) — calling `/auth/role` again with the other value switches sides and creates the second profile row if it doesn't exist yet. Nothing about existing deals/briefs/etc. changes when you switch.

`POST /auth/login` / `POST /auth/refresh` return the same token pair shape for returning sessions — no role call needed on login, since the row already exists from signup.

## 2. Creator onboarding (optional, but gates parts of the creator surface)

```
PATCH /creator-profile 🔒                       — name, bio, niches, starting_rate, typical_turnaround_days
POST  /creator-profile/portfolio 🔒              — one call per media item (pre-signed S3 URL, not a file upload)
GET   /social-accounts/:platform/oauth-url 🔒    — returns 501 until OAuth env vars are set
POST  /social-accounts/:platform/callback 🔒     — returns 501 until OAuth env vars are set
```

None of these block anything else in the API — a creator with an empty profile can still bid on briefs. They only affect what shows up in `GET /creators/search` and `GET /creators/:id`.

## 3. Two paths into a Deal

Both converge on the same `Deal` object and the same lifecycle (§4). Pick based on who's initiating.

### 3a. Client posts a brief, creators bid

```
POST /briefs 🔒                        — client
GET  /briefs/feed 🔒                   — creator, browses open briefs (defaults to their own niches)
POST /briefs/:id/bids 🔒               — creator                    -> notifies client: bid_received
GET  /briefs/:id/bids 🔒               — client, reviews bids
POST /bids/:id/accept 🔒               — client                     -> creates Deal (status: negotiating)
```
Accepting a bid auto-declines every other pending bid on that brief and moves the brief to `in_progress`.

### 3b. Client sends a direct offer to a specific creator

```
GET  /creators/search 🔒               — client finds a creator
POST /offers 🔒                        — client                     -> creates/reuses a Thread as a side effect
POST /offers/:id/counter 🔒            — either participant         -> notifies the other side: offer_countered
POST /offers/:id/accept 🔒             — either participant          -> creates Deal (status: negotiating, source: direct_offer)
POST /offers/:id/decline 🔒            — either participant
```

## 4. Deal lifecycle — the state machine

One authoritative transition table in `src/modules/deals/deal.state.ts` governs every `Deal.status` change; every endpoint below maps to exactly one transition, and each only succeeds from the listed `from` state(s) (otherwise `409`).

```
negotiating
  -> POST /deals/:id/agreement 🔒 (client)              -> agreement_pending
  -> POST /deals/:id/cancel 🔒                           -> cancelled

agreement_pending
  -> POST /deals/:id/agreement/consent 🔒 (creator)      (does NOT change Deal.status — sets creator_consented_at on the Agreement)
  -> POST /deals/:id/fund 🔒 (client)                    -> escrow_funded -> in_production   (both in one call/transaction)
  -> POST /deals/:id/cancel 🔒                           -> cancelled

in_production / changes_requested
  -> POST /deals/:id/drafts 🔒 (creator)                 -> draft_submitted    -> notifies client: draft_submitted

draft_submitted
  -> POST /drafts/:id/approve 🔒 (client)                -> approved           -> notifies creator: draft_approved
  -> POST /drafts/:id/request-changes 🔒 (client)        -> changes_requested  -> notifies creator: changes_requested
       (then back to draft_submitted via another POST /deals/:id/drafts)

approved
  -> POST /deals/:id/mark-live 🔒 (creator)              -> live

live
  -> POST /internal/escrow/release-due-payouts           -> completed  (cron-only, X-Internal-Secret header, not user-initiated)

completed
  -> POST /deals/:id/review 🔒 (either party)             -> notifies the other party: review_received
```

**Fund requires consent first.** `POST /deals/:id/fund` re-checks `creator_consented_at` and returns `400` if the creator hasn't consented yet, even though the state machine alone would allow it from `agreement_pending`.

**Payout methods must exist before payout, not before funding.** `POST /payout-methods` (creator, Stripe Connect Express) only needs to happen before the cron-driven `RELEASE_PAYOUT` step reaches this deal — it isn't checked at fund time. Similarly, `POST /payment-methods` (client, Stripe SetupIntent) must exist before `POST /deals/:id/fund`, since that call needs a `payment_method_id` to charge.

`GET /deals/mine` / `GET /deals/:id` return the deal with `agreement` and `escrow` nested (each `null` until set) — poll these rather than trying to track state client-side.

## 5. Messaging

A `Thread` is created automatically as a side effect of `POST /bids/:id/accept`, `POST /offers/:id/accept`, and `POST /offers` (see §3) — there's no `POST /threads` endpoint, threads are never created directly.

```
GET  /threads 🔒                              — list, sorted by last_message.created_at desc
GET  /threads/:id/messages 🔒?before=<id>     — cursor pagination, 30/page, newest first
POST /threads/:id/messages 🔒                 — { text } and/or { attachment_url }
```

## 6. Notifications — trigger -> recipient map

| Endpoint that fires it | `type` | Recipient |
|---|---|---|
| `POST /briefs/:id/bids` | `bid_received` | the brief's client |
| `POST /offers/:id/counter` | `offer_countered` | the other participant |
| `POST /deals/:id/fund` | `escrow_funded` | the deal's creator |
| `POST /deals/:id/drafts` | `draft_submitted` | the deal's client |
| `POST /drafts/:id/approve` | `draft_approved` | the deal's creator |
| `POST /drafts/:id/request-changes` | `changes_requested` | the deal's creator |
| `POST /deals/:id/review` | `review_received` | the reviewee |

```
GET  /notifications 🔒?unread_only=true
POST /notifications/:id/read 🔒
POST /push-tokens 🔒                   — register a device for push, independent of the above
```

## 7. Settings — anytime, no ordering constraints

```
GET   /me 🔒
PATCH /me 🔒     — avatar_url (written to whichever profile you hold), notification_prefs
```
