# Vouch API Reference

Generated from the implementation in `src/`, not from the spec — every response shape below is what the code actually returns. Cross-reference: [`Vouch - Backend Requirements.md`](../Vouch%20-%20Backend%20Requirements.md) §3.

## Conventions

- **Base URL**: `http://localhost:4000` in dev (`PORT` in `.env`).
- **Auth**: `Authorization: Bearer <access_token>` on every route marked 🔒 below. Tokens come from `/auth/signup`, `/auth/login`, or `/auth/refresh`.
- **Wire format**: all request and response bodies are `snake_case`, regardless of the camelCase used internally (Prisma/TS). Timestamps are ISO 8601 (`2026-08-19T14:32:00.000Z`). Every decimal field — money and `avg_rating` alike — is a string fixed at 2 places (`"450.00"`, `"4.90"`), normalized in `lib/caseConvert.ts` rather than left to decimal.js's default `toString()`, which silently drops trailing zeros regardless of the column's declared scale (a live test against a real database caught a `DECIMAL(10,2)` column round-tripping as `"250"` before this was fixed).
- **Errors** all follow one shape:
  ```json
  { "error": "message" }
  ```
  Zod validation failures add a `details` field:
  ```json
  { "error": "Validation failed", "details": { "fieldErrors": { "email": ["Invalid email"] } } }
  ```
  Status codes used: `400` validation/business-rule rejection, `401` missing/invalid token, `403` wrong owner/role, `404` not found, `409` conflicting state (e.g. re-accepting an already-accepted bid), `501` real integration not configured yet (Stripe/OAuth — see below). Each endpoint below only calls out the *non-generic* errors specific to it.
- **Pagination**: only `GET /threads/:id/messages` is paginated (cursor via `?before=`). Plain list endpoints (`/briefs/mine`, `/bids/mine`, etc.) return everything — the original doc's "`all list routes support ?page=&limit=`" convention was never implemented. Flagging this as a known gap, not a silent omission.
- **Not faked**: endpoints touching Stripe (escrow fund, payouts, Connect onboarding) or OAuth (social account linking, OAuth signup) run real SDK calls gated behind env vars. Until you set `STRIPE_SECRET_KEY` / the platform `*_CLIENT_ID` vars, they return `501` rather than pretending to succeed — see `.env.example`.

---

## Auth — `/auth`

### `POST /auth/signup`
Password path only — OAuth is real code gated behind config, see below.

**Request**
```json
{ "email": "reya@example.com", "password": "correcthorse123" }
```
**Response `201`**
```json
{ "access_token": "eyJhbGciOi...", "refresh_token": "eyJhbGciOi..." }
```
**Or, OAuth path** `{ "oauth_provider": "google", "oauth_token": "..." }` → **`501`** `{ "error": "OAuth signup is not configured yet" }` — verifying the token against the real provider needs credentials that aren't wired up; accepting it unverified would let anyone mint an account for any email, so this fails loudly instead.
**Errors**: `409` email already registered.

### `POST /auth/login`
**Request** `{ "email": "reya@example.com", "password": "correcthorse123" }`
**Response `200`** — same shape as signup: `{ "access_token": "...", "refresh_token": "..." }`
**Errors**: `401` wrong password, or the account is OAuth-only (no `password_hash`).

### `POST /auth/refresh`
**Request** `{ "refresh_token": "eyJhbGciOi..." }`
**Response `200`** — fresh `{ "access_token": "...", "refresh_token": "..." }`. Stateless JWTs, so this is a re-sign, not a rotation against stored state.
**Errors**: `401` invalid/expired.

### `POST /auth/role` 🔒
Switches which side of the app you're in; creates the profile row on first switch (see the nullability note in `schema.prisma` — a fresh `CreatorProfile`/`ClientProfile` has everything but `user_id` null until onboarding fills it in).

**Request** `{ "role": "creator" }`
**Response `200`**
```json
{
  "id": "5b1f7c2e-...",
  "email": "reya@example.com",
  "active_role": "creator",
  "has_client_profile": false,
  "has_creator_profile": true
}
```

### `POST /auth/logout` 🔒
No server-side session to invalidate — no refresh-token table exists in §2's data model. Purely a signal for the client to discard its tokens.

**Response `200`** `{ "ok": true }`

---

## Onboarding — `/social-accounts`, `/creator-profile` 🔒 (all routes)

### `GET /social-accounts/:platform/oauth-url`
`:platform` is `instagram | tiktok | youtube | facebook`.

**Response `200`** `{ "url": "https://api.instagram.com/oauth/authorize?client_id=...&redirect_uri=...&scope=...&response_type=code" }`
**Errors**: `501` if that platform's `*_CLIENT_ID`/`OAUTH_REDIRECT_BASE_URL` env vars aren't set (true out of the box).

### `POST /social-accounts/:platform/callback`
**Request** `{ "code": "abc123" }`
**Response `200`** (once configured)
```json
{
  "id": "8a2e...",
  "creator_id": "5b1f7c2e-...",
  "platform": "instagram",
  "handle": "reya.creates",
  "follower_count": 142000,
  "engagement_rate": "4.20",
  "verified": true,
  "oauth_token_ref": "...",
  "last_synced_at": "2026-08-19T14:32:00.000Z"
}
```
**Errors**: `501` (token exchange isn't implemented — real endpoint, real config check, but no fabricated follower counts); `403` if you're not currently a creator.

### `DELETE /social-accounts/:id`
**Response `204`** — no body.
**Errors**: `403` not your account.

### `PATCH /creator-profile`
**Request** (all optional)
```json
{ "name": "Reya Okafor", "bio": "Beauty + product content.", "niches": ["beauty", "product"], "starting_rate": 250, "typical_turnaround_days": 3 }
```
**Response `200`**
```json
{
  "user_id": "5b1f7c2e-...",
  "name": "Reya Okafor",
  "bio": "Beauty + product content.",
  "niches": ["beauty", "product"],
  "starting_rate": "250.00",
  "typical_turnaround_days": 3,
  "avatar_url": null,
  "avg_rating": "0.00",
  "review_count": 0
}
```

### `POST /creator-profile/portfolio`
Body carries an already-uploaded S3 URL (pre-signed direct upload, per §5) — not a multipart file.

**Request** `{ "media_url": "https://vouch-media.s3.amazonaws.com/portfolio/abc.jpg" }`
**Response `201`** `{ "id": "...", "creator_id": "5b1f7c2e-...", "media_url": "https://...", "sort_order": 0 }`

### `DELETE /creator-profile/portfolio/:id`
**Response `204`**

---

## Briefs — `/briefs` 🔒 (all routes)

### `POST /briefs` — client
**Request**
```json
{
  "title": "15s product reel for launch",
  "format": "reel",
  "niche": "beauty",
  "description": "Handheld, natural light, 15s max.",
  "budget_min": 300,
  "budget_max": 600,
  "deadline": "2026-09-02",
  "reference_images": ["https://vouch-media.s3.amazonaws.com/refs/1.jpg"]
}
```
**Response `201`**
```json
{
  "id": "b7e1...",
  "client_id": "9c4a...",
  "title": "15s product reel for launch",
  "format": "reel",
  "niche": "beauty",
  "description": "Handheld, natural light, 15s max.",
  "budget_min": "300.00",
  "budget_max": "600.00",
  "deadline": "2026-09-02T00:00:00.000Z",
  "status": "open",
  "created_at": "2026-08-19T14:32:00.000Z",
  "reference_images": [
    { "id": "...", "brief_id": "b7e1...", "image_url": "https://vouch-media.s3.amazonaws.com/refs/1.jpg" }
  ]
}
```
**Errors**: `400` if `budget_max < budget_min`.

### `GET /briefs/mine?status=open` — client
**Response `200`** — array, each brief plus a bid count:
```json
[
  {
    "id": "b7e1...", "client_id": "9c4a...", "title": "15s product reel for launch",
    "format": "reel", "niche": "beauty", "budget_min": "300.00", "budget_max": "600.00",
    "deadline": "2026-09-02T00:00:00.000Z", "status": "open", "created_at": "2026-08-19T14:32:00.000Z",
    "_count": { "bids": 6 }
  }
]
```

### `GET /briefs/feed?niche=&budget_min=&format=` — creator
Defaults to the creator's own `niches` when `?niche=` is omitted. Same shape as `/briefs/mine`, filtered to `status: "open"`.

### `GET /briefs/:id` — any authenticated user
**Response `200`** — brief + `reference_images[]` + `_count.bids`.

### `PATCH /briefs/:id` — client, owner, only while `status: "open"`
**Request**: any subset of the `POST /briefs` fields.
**Response `200`** — updated brief.
**Errors**: `403` not your brief; `409` brief isn't open.

### `POST /briefs/:id/cancel` — client, owner
**Response `200`** — brief with `status: "cancelled"`.
**Errors**: `409` if a bid has already been accepted.

---

## Bids — `/briefs/:id/bids`, `/bids` 🔒 (all routes)

### `POST /briefs/:id/bids` — creator
**Request** `{ "price": 450, "delivery_days": 3, "note": "Can start Monday." }`
**Response `201`**
```json
{
  "id": "f2c9...", "brief_id": "b7e1...", "creator_id": "5b1f7c2e-...",
  "price": "450.00", "delivery_days": 3, "note": "Can start Monday.",
  "status": "pending", "created_at": "2026-08-19T14:32:00.000Z"
}
```
**Errors**: `409` brief not open, or you already have a bid on it (see `PATCH`/`DELETE` below instead).

### `GET /briefs/:id/bids` — client, owner
**Response `200`** — array of bids, each with a trimmed creator summary:
```json
[
  {
    "id": "f2c9...", "brief_id": "b7e1...", "creator_id": "5b1f7c2e-...",
    "price": "450.00", "delivery_days": 3, "note": "Can start Monday.",
    "status": "pending", "created_at": "2026-08-19T14:32:00.000Z",
    "creator": { "user_id": "5b1f7c2e-...", "avatar_url": null, "avg_rating": "4.90" }
  }
]
```

### `GET /bids/mine` — creator
Same bid shape, with the full parent `brief` nested instead of a creator summary.

### `PATCH /bids/:id` — creator, owner, only while `pending`
Not in the original doc — added because rule 8 requires update/withdraw and no endpoint existed for either.
**Request** (any subset) `{ "price": 480, "delivery_days": 2, "note": "..." }`
**Response `200`** — updated bid.
**Errors**: `409` bid isn't pending anymore.

### `DELETE /bids/:id` — creator, owner, only while `pending`
Hard delete (no `withdrawn` status exists), so the unique `(brief_id, creator_id)` constraint frees up for a fresh bid.
**Response `204`**

### `POST /bids/:id/accept` — client, owner of the brief
Declines every other pending bid on the brief, moves the brief to `in_progress`, creates the `Deal`.
**Response `201`**
```json
{
  "id": "d41a...", "client_id": "9c4a...", "creator_id": "5b1f7c2e-...",
  "brief_id": "b7e1...", "offer_id": null, "source": "bid",
  "agreed_price": "450.00", "status": "negotiating",
  "created_at": "2026-08-19T14:32:00.000Z", "updated_at": "2026-08-19T14:32:00.000Z"
}
```

---

## Creators directory — `/creators` 🔒 (all routes)

### `GET /creators/search?q=&niche=&followers_min=&followers_max=&budget_max=`
**Response `200`**
```json
[
  {
    "user_id": "5b1f7c2e-...", "name": "Reya Okafor", "bio": "...",
    "niches": ["beauty", "product"], "starting_rate": "250.00", "typical_turnaround_days": 3,
    "avatar_url": null, "avg_rating": "4.90", "review_count": 38,
    "social_accounts": [
      { "id": "...", "creator_id": "5b1f7c2e-...", "platform": "instagram", "handle": "reya.creates", "follower_count": 142000, "engagement_rate": "4.20", "verified": true, "oauth_token_ref": "...", "last_synced_at": "..." }
    ],
    "is_verified": true
  }
]
```
`is_verified` is always computed here (rule 2), never a stored column.

### `GET /creators/:id`
Same shape as one search result, plus `portfolio_items: [{ id, creator_id, media_url, sort_order }]`.
**Errors**: `404` no such creator.

---

## Direct offers & negotiation — `/offers` 🔒 (all routes)

### `POST /offers` — client
**Request** `{ "creator_id": "5b1f7c2e-...", "brief_id": null, "price": 520, "format": "reel", "turnaround_days": 3, "message": "Loved your spring campaign." }`
**Response `201`**
```json
{
  "id": "9f0e...", "client_id": "9c4a...", "creator_id": "5b1f7c2e-...", "brief_id": null,
  "price": "520.00", "format": "reel", "turnaround_days": 3, "message": "Loved your spring campaign.",
  "status": "pending", "created_at": "2026-08-19T14:32:00.000Z"
}
```
A `Thread` between client and creator is created (or reused) as a side effect — not documented in the original spec, but every design-spec screen assumes one already exists.

### `GET /offers/mine`
**Response `200`** — array of offers (client's sent + creator's received, same shape as above).

### `GET /offers/:id` — participant
Same offer shape plus `revisions`:
```json
"revisions": [
  { "id": "...", "offer_id": "9f0e...", "proposed_by": "creator", "price": "600.00", "turnaround_days": 4, "note": "Covers a second usage license.", "created_at": "..." }
]
```

### `POST /offers/:id/counter` — participant
**Request** `{ "price": 600, "turnaround_days": 4, "note": "Covers a second usage license." }`
**Response `200`** — offer updated to `price: "600.00"`, `status: "countered"` (a new `OfferRevision` is appended, not returned inline here — fetch via `GET /offers/:id`).
**Errors**: `409` offer already accepted/declined.

### `POST /offers/:id/accept` — participant
**Response `201`** — a `Deal`, same shape as `POST /bids/:id/accept` but with `"source": "direct_offer"` and `offer_id` set.

### `POST /offers/:id/decline` — participant
**Response `200`** — offer with `status: "declined"`.

---

## Agreement & consent — `/deals/:id/agreement...` 🔒 (all routes)

### `POST /deals/:id/agreement` — client, deal party
Moves the deal `negotiating → agreement_pending`.
**Request** `{ "usage_rights": "paid_ads", "live_duration_days": 60, "approval_required": true, "min_views": null }`
**Response `201`**
```json
{
  "id": "a1c8...", "deal_id": "d41a...", "usage_rights": "paid_ads",
  "live_duration_days": 60, "approval_required": true, "min_views": null,
  "client_consented_at": "2026-08-19T14:32:00.000Z", "creator_consented_at": null
}
```

### `GET /deals/:id/agreement` — either party
Same shape. **Errors**: `404` if no agreement set yet.

### `POST /deals/:id/agreement/consent` — creator, deal party
**The hard gate (rule 1).** `consented` must be the literal boolean `true` — `"true"`, `1`, or omitting it all reject.
**Request** `{ "consented": true }`
**Response `200`** — agreement with `creator_consented_at` now set.
**Errors**: `400` `{ "error": "consented must be true" }`, or `{ "error": "Client has not set terms yet" }` if `client_consented_at` is still null.

---

## Escrow & payments — `/deals/:id/fund`, `/deals/:id/mark-live`, `/internal`, `/transactions`, `/payment-methods`, `/payout-methods`

### `POST /deals/:id/fund` 🔒 — client, deal party
Real Stripe manual-capture `PaymentIntent` before any DB write — never marks a deal funded for a charge that didn't happen.
**Request** `{ "payment_method_id": "3d2e..." }` (your saved `PaymentMethod.id`, not Stripe's)
**Response `200`**
```json
{
  "id": "e5b2...", "deal_id": "d41a...", "amount": "450.00",
  "funded_at": "2026-08-19T14:32:00.000Z", "live_started_at": null,
  "live_url": null, "payout_released_at": null, "status": "held"
}
```
**Errors**: `400` `{ "error": "Creator has not consented to the agreement yet" }` (rule 1, re-checked here per the doc's explicit instruction); `501` if `STRIPE_SECRET_KEY` isn't set.

### `POST /deals/:id/mark-live` 🔒 — creator, deal party
**Request** `{ "live_url": "https://instagram.com/p/abc123" }` (optional)
**Response `200`** — escrow with `live_started_at`/`live_url` set, `status` still `"held"` (payout release is a separate, time-based step).

### `POST /internal/escrow/release-due-payouts`
Not JWT-gated — no user initiates this. Requires header `X-Internal-Secret: <INTERNAL_API_SECRET>`. Meant to be hit by a cron/scheduler, not the app.
**Response `200`**
```json
{ "released": ["d41a..."], "failed": [{ "dealId": "8b3f...", "reason": "Creator 5b1f... has no payout method on file" }] }
```
**Errors**: `401` wrong/missing secret; `501` if `INTERNAL_API_SECRET` isn't set.

### `GET /transactions/mine` 🔒
**Response `200`**
```json
[
  { "id": "...", "user_id": "9c4a...", "deal_id": "d41a...", "type": "escrow_fund", "amount": "450.00", "status": "succeeded", "provider_ref": "pi_...", "created_at": "..." }
]
```

### `POST /payment-methods` 🔒 — client
Client confirms a Stripe `SetupIntent` first (card data never touches this API) — this just attaches the resulting `PaymentMethod` id and reads its card details back from Stripe.
**Request** `{ "payment_method_id": "pm_1P..." }` (Stripe's id, not ours — the response below returns *our* row id)
**Response `201`** `{ "id": "3d2e...", "client_id": "9c4a...", "provider_token": "pm_1P...", "brand": "visa", "last4": "4242", "is_default": true }`

### `GET /payment-methods` 🔒 — client
**Response `200`** — array of the shape above.

### `POST /payout-methods` 🔒 — creator
Creates a Stripe Connect Express account (or reuses one already started) and a hosted onboarding link.
**Request** `{ "schedule": "weekly" }` (optional, defaults to `"weekly"`)
**Response `201`**
```json
{
  "payout_method": { "id": "...", "creator_id": "5b1f7c2e-...", "provider": "stripe_connect", "account_ref": "acct_...", "schedule": "weekly" },
  "onboarding_url": "https://connect.stripe.com/setup/..."
}
```
**Errors**: `501` if Stripe or `STRIPE_CONNECT_RETURN_URL`/`REFRESH_URL` aren't set.

### `GET /payout-methods` 🔒 — creator
**Response `200`** — array of `payout_method` objects (no `onboarding_url` on repeat fetches).

---

## Drafts — `/deals/:id/drafts`, `/drafts/:id/...` 🔒 (all routes)

### `POST /deals/:id/drafts` — creator, deal party
Pre-signed S3 URL flow, same as portfolio items — `file_url` is expected to already point at S3.
**Request** `{ "file_url": "https://vouch-media.s3.amazonaws.com/drafts/abc.mp4", "note": "First cut — happy to adjust the opening shot." }`
**Response `201`**
```json
{
  "id": "c9d1...", "deal_id": "d41a...", "file_url": "https://vouch-media.s3.amazonaws.com/drafts/abc.mp4",
  "note": "First cut — happy to adjust the opening shot.", "status": "submitted",
  "submitted_at": "2026-08-19T14:32:00.000Z", "reviewed_at": null, "client_feedback": null
}
```

### `GET /deals/:id/drafts` — either party
**Response `200`** — array of the shape above, newest first.

### `POST /drafts/:id/approve` — client, deal party
**Response `200`** — draft with `status: "approved"`, `reviewed_at` set.
**Errors**: `409` draft already reviewed.

### `POST /drafts/:id/request-changes` — client, deal party
**Request** `{ "feedback": "Can you use the overhead shot as the opener instead?" }` (required)
**Response `200`** — draft with `status: "changes_requested"`, `client_feedback` set. Only touches `Draft` + `Deal.status` — never the `Agreement` row (rule 5).

---

## Messaging — `/threads` 🔒 (all routes)

### `GET /threads`
**Response `200`**
```json
[
  {
    "id": "t1a2...", "participant_a_id": "5b1f7c2e-...", "participant_b_id": "9c4a...",
    "deal_id": "d41a...", "brief_id": "b7e1...",
    "participant_a": { "id": "5b1f7c2e-...", "email": "reya@example.com" },
    "participant_b": { "id": "9c4a...", "email": "hello@lumen.example.com" },
    "deal": { "...": "full Deal row" },
    "brief": { "...": "full Brief row" },
    "other_participant_id": "9c4a...",
    "last_message": { "id": "...", "thread_id": "t1a2...", "sender_id": "9c4a...", "text": "Sounds good — sending the agreement now", "created_at": "...", "read_at": null },
    "is_unread": true
  }
]
```
Sorted by `last_message.created_at` descending. `other_participant_id`/`last_message`/`is_unread` are computed, not raw columns.

### `GET /threads/:id/messages?before=<message_id>` — participant
Cursor pagination, 30 per page, newest first.
**Response `200`**
```json
[
  { "id": "...", "thread_id": "t1a2...", "sender_id": "9c4a...", "text": "Sounds good — sending the agreement now", "attachment_url": null, "system_event": null, "created_at": "...", "read_at": null }
]
```

### `POST /threads/:id/messages` — participant
**Request** `{ "text": "Sure, send me the terms" }` (or `attachment_url`, or both — at least one required)
**Response `201`** — the created message, same shape as above.

---

## Notifications — `/notifications`, `/push-tokens` 🔒 (all routes)

### `GET /notifications?unread_only=true`
**Response `200`**
```json
[
  { "id": "...", "user_id": "5b1f7c2e-...", "type": "escrow_funded", "payload": { "deal_id": "d41a...", "amount": "450.00" }, "read_at": null, "created_at": "..." }
]
```
`type` is a free string, not a DB enum (§2.7 documents it with a trailing "..." — open-ended by design). Known values today, each wired to a real event: `bid_received`, `offer_countered`, `escrow_funded`, `draft_submitted`, `draft_approved`, `changes_requested`, `review_received`.

### `POST /notifications/:id/read`
**Response `200`** — notification with `read_at` set.
**Errors**: `403` not yours.

### `POST /push-tokens`
**Request** `{ "platform": "ios", "token": "fcm-or-apns-token" }`
**Response `201`** `{ "id": "...", "user_id": "5b1f7c2e-...", "platform": "ios", "token": "...", "created_at": "..." }`

---

## Reviews — `/deals/:id/review`, `/users/:id/reviews` 🔒 (all routes)

### `POST /deals/:id/review` — either deal party
**Request** `{ "rating": 5, "tags": ["great_communication", "on_time"], "comment": "Would book again." }`
**Response `201`**
```json
{
  "id": "...", "deal_id": "d41a...", "reviewer_id": "9c4a...", "reviewee_id": "5b1f7c2e-...",
  "rating": 5, "tags": ["great_communication", "on_time"], "comment": "Would book again.",
  "created_at": "2026-08-19T14:32:00.000Z"
}
```
If the reviewee has a `CreatorProfile`, its `avg_rating`/`review_count` are recomputed in the same call (rule 7 — only postable once `Deal.status = "completed"`).
**Errors**: `409` deal isn't completed yet.

### `GET /users/:id/reviews`
**Response `200`**
```json
{
  "avg_rating": "4.90",
  "review_count": 38,
  "reviews": [
    { "id": "...", "deal_id": "...", "reviewer_id": "...", "reviewee_id": "5b1f7c2e-...", "rating": 5, "tags": ["great_communication"], "comment": "...", "created_at": "..." }
  ]
}
```
`avg_rating`/`review_count` come from `CreatorProfile` when the user has one; otherwise falls back to `reviews.length`.

---

## Settings — `/me` 🔒 (all routes)

### `GET /me`
**Response `200`**
```json
{
  "id": "5b1f7c2e-...", "email": "reya@example.com", "active_role": "creator",
  "has_client_profile": false, "has_creator_profile": true,
  "notification_prefs": null, "created_at": "...", "updated_at": "...",
  "client_profile": null,
  "creator_profile": { "user_id": "5b1f7c2e-...", "name": "Reya Okafor", "...": "full CreatorProfile row" }
}
```
Never includes `password_hash` — it's excluded at the Prisma query level, not stripped after the fact.

### `PATCH /me`
**Request** `{ "avatar_url": "https://...", "notification_prefs": { "push": true, "email_digest": false } }`
`avatar_url` isn't a `User` column — it's written to whichever of `client_profile`/`creator_profile` you actually have (kept in sync across both if you hold both roles).
**Response `200`** — same shape as `GET /me`.

---

## Deals (core) — `/deals` 🔒 (all routes)

Not in the original §3 table — added because nothing let either side fetch a deal's own state, list their deals, or reach the `cancelled` state the §2.4 machine defines.

### `GET /deals/mine`
**Response `200`** — array of deals (same shape as `POST /bids/:id/accept`'s response) plus nested `agreement` and `escrow` (each nullable until set).

### `GET /deals/:id` — participant
Same single-deal shape as above.

### `POST /deals/:id/cancel` — participant
Only valid while `status` is `negotiating` or `agreement_pending` (per §2.4's `cancellable_states`).
**Response `200`** — deal with `status: "cancelled"`.
**Errors**: `409` if the deal has moved past those two states.

---

## Not built in this pass

- **`WS /ws/threads/:id`** — real-time message delivery. REST send/receive above works as a polling fallback; the live socket layer is a separate infra decision (self-hosted `ws` vs. a hosted service like Pusher/Ably per §5) that needs picking before wiring connection auth and subscriptions.
