// Generator for docs/openapi.json — run with `npm run docs:build` (or
// `node scripts/build-openapi.js > docs/openapi.json` from the repo root).
// Source of truth for the spec is this file, not docs/openapi.json directly —
// re-run after any route/schema change and commit the regenerated JSON too.

const money = { type: "string", example: "450.00", description: "Decimal string at the column's real declared scale (DECIMAL(10,2)) — mysql2 returns it pre-formatted, no normalization needed" };
const uuid = { type: "string", format: "uuid", example: "5b1f7c2e-3a4b-4c1d-9e2f-1a2b3c4d5e6f" };
const timestamp = { type: "string", format: "date-time", example: "2026-08-19T14:32:00.000Z" };
const nullableTimestamp = { ...timestamp, nullable: true };

const ErrorSchema = {
  type: "object",
  properties: {
    error: { type: "string", example: "Not found" },
    details: { type: "object", nullable: true, description: "Present only on 400s from zod validation failures" },
  },
  required: ["error"],
};

const errorResponse = (description, example) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example } },
});

const responses = {
  Unauthorized: errorResponse("Missing or invalid bearer token", { error: "Missing bearer token" }),
  Forbidden: errorResponse("Not the owner/participant/role this route requires", { error: "Not your deal" }),
  NotFound: errorResponse("No such resource", { error: "Not found" }),
  Conflict: errorResponse("Resource is in a state that doesn't allow this action", { error: "This bid is no longer pending" }),
  ValidationError: errorResponse("Request body/query failed validation", {
    error: "Validation failed",
    details: { fieldErrors: { email: ["Invalid email"] } },
  }),
  NotConfigured: errorResponse("Real integration (Stripe/OAuth provider/internal secret) has no credentials configured yet — not faked", {
    error: "Stripe is not configured (missing STRIPE_SECRET_KEY)",
  }),
};

const bearerAuth = [{ bearerAuth: [] }];

// ---------- component schemas (mirrors db/types.ts, snake_case wire format) ----------

const schemas = {
  Error: ErrorSchema,

  TokenPair: {
    type: "object",
    properties: { access_token: { type: "string" }, refresh_token: { type: "string" } },
  },

  ClientProfile: {
    type: "object",
    properties: {
      user_id: uuid,
      company_name: { type: "string", nullable: true, example: "Lumen Skincare" },
      avatar_url: { type: "string", nullable: true },
    },
  },

  CreatorProfile: {
    type: "object",
    properties: {
      user_id: uuid,
      name: { type: "string", nullable: true, example: "Reya Okafor" },
      bio: { type: "string", nullable: true },
      niches: { type: "array", items: { type: "string" }, nullable: true, example: ["beauty", "product"] },
      starting_rate: { ...money, nullable: true },
      typical_turnaround_days: { type: "integer", nullable: true, example: 3 },
      avatar_url: { type: "string", nullable: true },
      avg_rating: { type: "string", example: "4.9" },
      review_count: { type: "integer", example: 38 },
    },
  },

  User: {
    type: "object",
    properties: {
      id: uuid,
      email: { type: "string", format: "email" },
      active_role: { type: "string", enum: ["client", "creator"] },
      has_client_profile: { type: "boolean" },
      has_creator_profile: { type: "boolean" },
      notification_prefs: { type: "object", nullable: true, example: { push: true, email_digest: false } },
      created_at: timestamp,
      updated_at: timestamp,
      client_profile: { type: "object", allOf: [{ $ref: "#/components/schemas/ClientProfile" }], nullable: true },
      creator_profile: { type: "object", allOf: [{ $ref: "#/components/schemas/CreatorProfile" }], nullable: true },
    },
  },

  SocialAccount: {
    type: "object",
    properties: {
      id: uuid,
      creator_id: uuid,
      platform: { type: "string", enum: ["instagram", "tiktok", "youtube", "facebook"] },
      handle: { type: "string", example: "reya.creates" },
      follower_count: { type: "integer", example: 142000 },
      engagement_rate: { type: "string", nullable: true, example: "4.20" },
      verified: { type: "boolean" },
      oauth_token_ref: { type: "string", nullable: true },
      last_synced_at: nullableTimestamp,
    },
  },

  PortfolioItem: {
    type: "object",
    properties: { id: uuid, creator_id: uuid, media_url: { type: "string" }, sort_order: { type: "integer" } },
  },

  ReferenceImage: {
    type: "object",
    properties: { id: uuid, brief_id: uuid, image_url: { type: "string" } },
  },

  Brief: {
    type: "object",
    properties: {
      id: uuid,
      client_id: uuid,
      title: { type: "string", example: "15s product reel for launch" },
      format: { type: "string", enum: ["reel", "ugc", "youtube", "tiktok", "photo"] },
      niche: { type: "string", example: "beauty", description: "Not in the original spec's data model — added; see docs/openapi.json generation notes" },
      description: { type: "string" },
      budget_min: money,
      budget_max: money,
      deadline: { type: "string", format: "date", example: "2026-09-02" },
      status: { type: "string", enum: ["open", "in_progress", "completed", "cancelled"] },
      created_at: timestamp,
      reference_images: { type: "array", items: { $ref: "#/components/schemas/ReferenceImage" } },
      _count: {
        type: "object",
        properties: { bids: { type: "integer", example: 6 } },
        description: "Only present on list/detail responses that select it",
      },
    },
  },

  Bid: {
    type: "object",
    properties: {
      id: uuid,
      brief_id: uuid,
      creator_id: uuid,
      price: money,
      delivery_days: { type: "integer", example: 3 },
      note: { type: "string", nullable: true },
      status: { type: "string", enum: ["pending", "accepted", "declined"] },
      created_at: timestamp,
    },
  },

  OfferRevision: {
    type: "object",
    properties: {
      id: uuid,
      offer_id: uuid,
      proposed_by: { type: "string", enum: ["client", "creator"] },
      price: money,
      turnaround_days: { type: "integer" },
      note: { type: "string", nullable: true },
      created_at: timestamp,
    },
  },

  DirectOffer: {
    type: "object",
    properties: {
      id: uuid,
      client_id: uuid,
      creator_id: uuid,
      brief_id: { ...uuid, nullable: true },
      price: money,
      format: { type: "string", enum: ["reel", "ugc", "youtube", "tiktok", "photo"] },
      turnaround_days: { type: "integer" },
      message: { type: "string", nullable: true },
      status: { type: "string", enum: ["pending", "countered", "accepted", "declined"] },
      created_at: timestamp,
      revisions: { type: "array", items: { $ref: "#/components/schemas/OfferRevision" } },
    },
  },

  Deal: {
    type: "object",
    properties: {
      id: uuid,
      client_id: uuid,
      creator_id: uuid,
      brief_id: { ...uuid, nullable: true },
      offer_id: { ...uuid, nullable: true },
      source: { type: "string", enum: ["bid", "direct_offer"] },
      agreed_price: money,
      status: {
        type: "string",
        enum: ["negotiating", "agreement_pending", "escrow_funded", "in_production", "draft_submitted", "changes_requested", "approved", "live", "completed", "cancelled"],
      },
      created_at: timestamp,
      updated_at: timestamp,
      agreement: { type: "object", allOf: [{ $ref: "#/components/schemas/Agreement" }], nullable: true },
      escrow: { type: "object", allOf: [{ $ref: "#/components/schemas/Escrow" }], nullable: true },
    },
  },

  Agreement: {
    type: "object",
    properties: {
      id: uuid,
      deal_id: uuid,
      usage_rights: { type: "string", enum: ["organic", "paid_ads", "whitelisting"] },
      live_duration_days: { type: "integer", example: 60 },
      approval_required: { type: "boolean" },
      min_views: { type: "integer", nullable: true },
      client_consented_at: nullableTimestamp,
      creator_consented_at: nullableTimestamp,
    },
  },

  Draft: {
    type: "object",
    properties: {
      id: uuid,
      deal_id: uuid,
      file_url: { type: "string" },
      note: { type: "string", nullable: true },
      status: { type: "string", enum: ["submitted", "approved", "changes_requested"] },
      submitted_at: timestamp,
      reviewed_at: nullableTimestamp,
      client_feedback: { type: "string", nullable: true },
    },
  },

  Escrow: {
    type: "object",
    properties: {
      id: uuid,
      deal_id: uuid,
      amount: money,
      funded_at: nullableTimestamp,
      live_started_at: nullableTimestamp,
      live_url: { type: "string", nullable: true },
      payout_released_at: nullableTimestamp,
      status: { type: "string", enum: ["unfunded", "held", "released", "refunded"] },
    },
  },

  PaymentMethod: {
    type: "object",
    properties: {
      id: uuid,
      client_id: uuid,
      provider_token: { type: "string", example: "pm_1P..." },
      brand: { type: "string", example: "visa" },
      last4: { type: "string", example: "4242" },
      is_default: { type: "boolean" },
    },
  },

  PayoutMethod: {
    type: "object",
    properties: {
      id: uuid,
      creator_id: uuid,
      provider: { type: "string", enum: ["stripe_connect"] },
      account_ref: { type: "string", example: "acct_..." },
      schedule: { type: "string", enum: ["weekly", "biweekly"] },
    },
  },

  Transaction: {
    type: "object",
    properties: {
      id: uuid,
      user_id: uuid,
      deal_id: uuid,
      type: { type: "string", enum: ["escrow_fund", "payout", "refund"] },
      amount: money,
      status: { type: "string", enum: ["pending", "succeeded", "failed"] },
      provider_ref: { type: "string", nullable: true },
      created_at: timestamp,
    },
  },

  Message: {
    type: "object",
    properties: {
      id: uuid,
      thread_id: uuid,
      sender_id: uuid,
      text: { type: "string", nullable: true },
      attachment_url: { type: "string", nullable: true },
      system_event: { type: "string", nullable: true, example: "agreement_confirmed" },
      created_at: timestamp,
      read_at: nullableTimestamp,
    },
  },

  Thread: {
    type: "object",
    properties: {
      id: uuid,
      participant_a_id: uuid,
      participant_b_id: uuid,
      deal_id: { ...uuid, nullable: true },
      brief_id: { ...uuid, nullable: true },
      other_participant_id: { ...uuid, description: "Computed relative to the caller, not a stored column" },
      last_message: { type: "object", allOf: [{ $ref: "#/components/schemas/Message" }], nullable: true },
      is_unread: { type: "boolean", description: "Computed: true if last_message wasn't sent by the caller and has no read_at" },
    },
  },

  Notification: {
    type: "object",
    properties: {
      id: uuid,
      user_id: uuid,
      type: {
        type: "string",
        description: "Free string, not a DB enum — open-ended set per the original spec",
        example: "escrow_funded",
        enum: ["bid_received", "offer_countered", "escrow_funded", "draft_submitted", "draft_approved", "changes_requested", "review_received"],
      },
      payload: { type: "object", example: { deal_id: "d41a...", amount: "450.00" } },
      read_at: nullableTimestamp,
      created_at: timestamp,
    },
  },

  PushToken: {
    type: "object",
    properties: { id: uuid, user_id: uuid, platform: { type: "string", example: "ios" }, token: { type: "string" }, created_at: timestamp },
  },

  Review: {
    type: "object",
    properties: {
      id: uuid,
      deal_id: uuid,
      reviewer_id: uuid,
      reviewee_id: uuid,
      rating: { type: "integer", minimum: 1, maximum: 5 },
      tags: { type: "array", items: { type: "string", enum: ["great_communication", "on_time", "high_quality"] } },
      comment: { type: "string", nullable: true },
      created_at: timestamp,
    },
  },

  ReviewsForUser: {
    type: "object",
    properties: {
      avg_rating: { type: "string", nullable: true, example: "4.9" },
      review_count: { type: "integer", example: 38 },
      reviews: { type: "array", items: { $ref: "#/components/schemas/Review" } },
    },
  },

  ReleaseDuePayoutsSummary: {
    type: "object",
    properties: {
      released: { type: "array", items: uuid },
      failed: {
        type: "array",
        items: { type: "object", properties: { dealId: uuid, reason: { type: "string" } } },
      },
    },
  },
};

// ---------- paths ----------

const j = (schemaOrExample, example) => ({
  content: { "application/json": { schema: schemaOrExample, ...(example ? { example } : {}) } },
});
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const arrayOf = (name) => ({ type: "array", items: ref(name) });

function op({ summary, tags, security = bearerAuth, params = [], body, responsesExtra = {}, description }) {
  return {
    summary,
    ...(description ? { description } : {}),
    tags,
    security,
    ...(params.length ? { parameters: params } : {}),
    ...(body ? { requestBody: { required: true, ...j(body.schema, body.example) } } : {}),
    responses: {
      ...responsesExtra,
      "401": security.length ? { $ref: "#/components/responses/Unauthorized" } : undefined,
    },
  };
}

function pathParam(name, example, description) {
  return { name, in: "path", required: true, schema: { type: "string" }, example, ...(description ? { description } : {}) };
}
function queryParam(name, type, example, description) {
  return { name, in: "query", required: false, schema: { type }, ...(example !== undefined ? { example } : {}), ...(description ? { description } : {}) };
}

const paths = {
  "/auth/signup": {
    post: op({
      summary: "Create an account (password or OAuth)",
      tags: ["Auth"],
      security: [],
      body: {
        schema: {
          oneOf: [
            { type: "object", properties: { email: { type: "string", format: "email" }, password: { type: "string", minLength: 8 } }, required: ["email", "password"] },
            { type: "object", properties: { oauth_provider: { type: "string" }, oauth_token: { type: "string" } }, required: ["oauth_provider", "oauth_token"] },
          ],
        },
        example: { email: "reya@example.com", password: "correcthorse123" },
      },
      responsesExtra: {
        "201": { description: "Account created", ...j(ref("TokenPair")) },
        "409": errorResponse("Email already registered", { error: "An account with this email already exists" }),
        "501": { $ref: "#/components/responses/NotConfigured" },
      },
    }),
  },
  "/auth/login": {
    post: op({
      summary: "Log in with email + password",
      tags: ["Auth"],
      security: [],
      body: {
        schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } }, required: ["email", "password"] },
        example: { email: "reya@example.com", password: "correcthorse123" },
      },
      responsesExtra: {
        "200": { description: "OK", ...j(ref("TokenPair")) },
        "401": errorResponse("Wrong password, or the account is OAuth-only", { error: "Invalid email or password" }),
      },
    }),
  },
  "/auth/refresh": {
    post: op({
      summary: "Exchange a refresh token for a new token pair",
      tags: ["Auth"],
      security: [],
      body: { schema: { type: "object", properties: { refresh_token: { type: "string" } }, required: ["refresh_token"] } },
      responsesExtra: {
        "200": { description: "OK", ...j(ref("TokenPair")) },
        "401": errorResponse("Invalid or expired refresh token", { error: "Invalid or expired refresh token" }),
      },
    }),
  },
  "/auth/role": {
    post: op({
      summary: "Switch active role (client/creator); creates the profile row on first switch",
      tags: ["Auth"],
      body: { schema: { type: "object", properties: { role: { type: "string", enum: ["client", "creator"] } }, required: ["role"] } },
      responsesExtra: {
        "200": {
          description: "OK",
          ...j(
            { type: "object", properties: { id: uuid, email: { type: "string" }, active_role: { type: "string" }, has_client_profile: { type: "boolean" }, has_creator_profile: { type: "boolean" } } },
            { id: "5b1f7c2e-...", email: "reya@example.com", active_role: "creator", has_client_profile: false, has_creator_profile: true },
          ),
        },
      },
    }),
  },
  "/auth/logout": {
    post: op({
      summary: "Discard tokens client-side (stateless JWTs — nothing to revoke server-side)",
      tags: ["Auth"],
      responsesExtra: { "200": { description: "OK", ...j({ type: "object", properties: { ok: { type: "boolean" } } }, { ok: true }) } },
    }),
  },

  "/social-accounts/{platform}/oauth-url": {
    get: op({
      summary: "Get the OAuth authorize URL for a platform",
      tags: ["Onboarding"],
      params: [pathParam("platform", "instagram")],
      responsesExtra: {
        "200": { description: "OK", ...j({ type: "object", properties: { url: { type: "string" } } }, { url: "https://api.instagram.com/oauth/authorize?..." }) },
        "501": { $ref: "#/components/responses/NotConfigured" },
      },
    }),
  },
  "/social-accounts/{platform}/callback": {
    post: op({
      summary: "Exchange an OAuth code for follower/engagement stats; sets verified=true",
      tags: ["Onboarding"],
      params: [pathParam("platform", "instagram")],
      body: { schema: { type: "object", properties: { code: { type: "string" } }, required: ["code"] } },
      responsesExtra: {
        "200": { description: "OK", ...j(ref("SocialAccount")) },
        "403": { $ref: "#/components/responses/Forbidden" },
        "501": { $ref: "#/components/responses/NotConfigured" },
      },
    }),
  },
  "/social-accounts/{id}": {
    delete: op({
      summary: "Unlink a social account",
      tags: ["Onboarding"],
      params: [pathParam("id", "8a2e...")],
      responsesExtra: { "204": { description: "Unlinked" }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
  },
  "/creator-profile": {
    patch: op({
      summary: "Update the creator profile",
      tags: ["Onboarding"],
      body: {
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            bio: { type: "string" },
            niches: { type: "array", items: { type: "string" } },
            starting_rate: { type: "number" },
            typical_turnaround_days: { type: "integer" },
          },
        },
        example: { name: "Reya Okafor", bio: "Beauty + product content.", niches: ["beauty", "product"], starting_rate: 250, typical_turnaround_days: 3 },
      },
      responsesExtra: { "200": { description: "OK", ...j(ref("CreatorProfile")) }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
  },
  "/creator-profile/portfolio": {
    post: op({
      summary: "Add a portfolio item (media_url from a pre-signed S3 upload, not multipart)",
      tags: ["Onboarding"],
      body: { schema: { type: "object", properties: { media_url: { type: "string" } }, required: ["media_url"] } },
      responsesExtra: { "201": { description: "Created", ...j(ref("PortfolioItem")) } },
    }),
  },
  "/creator-profile/portfolio/{id}": {
    delete: op({
      summary: "Delete a portfolio item",
      tags: ["Onboarding"],
      params: [pathParam("id", "...")],
      responsesExtra: { "204": { description: "Deleted" }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
  },

  "/briefs": {
    post: op({
      summary: "Post a brief",
      tags: ["Briefs"],
      body: {
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            format: { type: "string", enum: ["reel", "ugc", "youtube", "tiktok", "photo"] },
            niche: { type: "string" },
            description: { type: "string" },
            budget_min: { type: "number" },
            budget_max: { type: "number" },
            deadline: { type: "string", format: "date" },
            reference_images: { type: "array", items: { type: "string" } },
          },
          required: ["title", "format", "niche", "description", "budget_min", "budget_max", "deadline"],
        },
        example: {
          title: "15s product reel for launch",
          format: "reel",
          niche: "beauty",
          description: "Handheld, natural light, 15s max.",
          budget_min: 300,
          budget_max: 600,
          deadline: "2026-09-02",
          reference_images: ["https://vouch-media.s3.amazonaws.com/refs/1.jpg"],
        },
      },
      responsesExtra: {
        "201": { description: "Created", ...j(ref("Brief")) },
        "400": errorResponse("budget_max < budget_min", { error: "budget_max must be >= budget_min" }),
      },
    }),
  },
  "/briefs/mine": {
    get: op({
      summary: "List the current client's briefs",
      tags: ["Briefs"],
      params: [queryParam("status", "string", "open")],
      responsesExtra: { "200": { description: "OK", ...j(arrayOf("Brief")) } },
    }),
  },
  "/briefs/feed": {
    get: op({
      summary: "Feed of open briefs for the current creator (defaults to their own niches)",
      tags: ["Briefs"],
      params: [queryParam("niche", "string"), queryParam("budget_min", "number"), queryParam("format", "string")],
      responsesExtra: { "200": { description: "OK", ...j(arrayOf("Brief")) } },
    }),
  },
  "/briefs/{id}": {
    get: op({
      summary: "Get a brief",
      tags: ["Briefs"],
      params: [pathParam("id", "b7e1...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Brief")) }, "404": { $ref: "#/components/responses/NotFound" } },
    }),
    patch: op({
      summary: "Edit a brief (owner only, only while open)",
      tags: ["Briefs"],
      params: [pathParam("id", "b7e1...")],
      body: { schema: { type: "object", description: "Any subset of the POST /briefs fields" } },
      responsesExtra: {
        "200": { description: "OK", ...j(ref("Brief")) },
        "403": { $ref: "#/components/responses/Forbidden" },
        "409": { $ref: "#/components/responses/Conflict" },
      },
    }),
  },
  "/briefs/{id}/cancel": {
    post: op({
      summary: "Cancel a brief (owner only, only if no bid accepted yet)",
      tags: ["Briefs"],
      params: [pathParam("id", "b7e1...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Brief")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/briefs/{id}/bids": {
    post: op({
      summary: "Submit a bid on a brief",
      tags: ["Bids"],
      params: [pathParam("id", "b7e1...")],
      body: {
        schema: { type: "object", properties: { price: { type: "number" }, delivery_days: { type: "integer" }, note: { type: "string" } }, required: ["price", "delivery_days"] },
        example: { price: 450, delivery_days: 3, note: "Can start Monday." },
      },
      responsesExtra: {
        "201": { description: "Created", ...j(ref("Bid")) },
        "409": errorResponse("Brief not open, or you already have a pending bid on it", { error: "You already have a bid on this brief — update or withdraw it instead" }),
      },
    }),
    get: op({
      summary: "List bids on a brief (owner only)",
      tags: ["Bids"],
      params: [pathParam("id", "b7e1...")],
      responsesExtra: {
        "200": {
          description: "OK",
          ...j({ type: "array", items: { allOf: [ref("Bid"), { type: "object", properties: { creator: { type: "object", properties: { user_id: uuid, avatar_url: { type: "string", nullable: true }, avg_rating: { type: "string" } } } } }] } }),
        },
        "403": { $ref: "#/components/responses/Forbidden" },
      },
    }),
  },
  "/bids/mine": {
    get: op({
      summary: "List the current creator's bids (each with its parent brief)",
      tags: ["Bids"],
      responsesExtra: { "200": { description: "OK", ...j({ type: "array", items: { allOf: [ref("Bid"), { type: "object", properties: { brief: ref("Brief") } }] } }) } },
    }),
  },
  "/bids/{id}": {
    patch: op({
      summary: "Update a bid (owner only, only while pending) — added, not in the original spec",
      tags: ["Bids"],
      params: [pathParam("id", "f2c9...")],
      body: { schema: { type: "object", properties: { price: { type: "number" }, delivery_days: { type: "integer" }, note: { type: "string" } } } },
      responsesExtra: { "200": { description: "OK", ...j(ref("Bid")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
    delete: op({
      summary: "Withdraw a bid (owner only, only while pending) — added, not in the original spec",
      tags: ["Bids"],
      params: [pathParam("id", "f2c9...")],
      responsesExtra: { "204": { description: "Withdrawn" }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/bids/{id}/accept": {
    post: op({
      summary: "Accept a bid — declines every other pending bid on the brief, creates the Deal",
      tags: ["Bids"],
      params: [pathParam("id", "f2c9...")],
      responsesExtra: { "201": { description: "Created", ...j(ref("Deal")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },

  "/creators/search": {
    get: op({
      summary: "Search the creator directory",
      tags: ["Creators"],
      params: [queryParam("q", "string"), queryParam("niche", "string"), queryParam("followers_min", "integer"), queryParam("followers_max", "integer"), queryParam("budget_max", "number")],
      responsesExtra: {
        "200": {
          description: "OK",
          ...j({ type: "array", items: { allOf: [ref("CreatorProfile"), { type: "object", properties: { social_accounts: { type: "array", items: ref("SocialAccount") }, is_verified: { type: "boolean" } } }] } }),
        },
      },
    }),
  },
  "/creators/{id}": {
    get: op({
      summary: "Get a creator's public profile",
      tags: ["Creators"],
      params: [pathParam("id", "5b1f7c2e-...")],
      responsesExtra: {
        "200": {
          description: "OK",
          ...j({
            allOf: [
              ref("CreatorProfile"),
              { type: "object", properties: { social_accounts: { type: "array", items: ref("SocialAccount") }, portfolio_items: { type: "array", items: ref("PortfolioItem") }, is_verified: { type: "boolean" } } },
            ],
          }),
        },
        "404": { $ref: "#/components/responses/NotFound" },
      },
    }),
  },

  "/offers": {
    post: op({
      summary: "Send a direct offer to a creator",
      tags: ["Offers"],
      body: {
        schema: {
          type: "object",
          properties: {
            creator_id: { type: "string", format: "uuid" },
            brief_id: { type: "string", format: "uuid", nullable: true },
            price: { type: "number" },
            format: { type: "string", enum: ["reel", "ugc", "youtube", "tiktok", "photo"] },
            turnaround_days: { type: "integer" },
            message: { type: "string" },
          },
          required: ["creator_id", "price", "format", "turnaround_days"],
        },
        example: { creator_id: "5b1f7c2e-...", price: 520, format: "reel", turnaround_days: 3, message: "Loved your spring campaign." },
      },
      responsesExtra: { "201": { description: "Created", ...j(ref("DirectOffer")) }, "404": { $ref: "#/components/responses/NotFound" } },
    }),
  },
  "/offers/mine": {
    get: op({ summary: "List offers you've sent or received", tags: ["Offers"], responsesExtra: { "200": { description: "OK", ...j(arrayOf("DirectOffer")) } } }),
  },
  "/offers/{id}": {
    get: op({
      summary: "Get an offer, including its full revision history",
      tags: ["Offers"],
      params: [pathParam("id", "9f0e...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("DirectOffer")) }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
  },
  "/offers/{id}/counter": {
    post: op({
      summary: "Counter an offer (either side)",
      tags: ["Offers"],
      params: [pathParam("id", "9f0e...")],
      body: {
        schema: { type: "object", properties: { price: { type: "number" }, turnaround_days: { type: "integer" }, note: { type: "string" } }, required: ["price", "turnaround_days"] },
        example: { price: 600, turnaround_days: 4, note: "Covers a second usage license." },
      },
      responsesExtra: { "200": { description: "OK", ...j(ref("DirectOffer")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/offers/{id}/accept": {
    post: op({
      summary: "Accept an offer — creates the Deal",
      tags: ["Offers"],
      params: [pathParam("id", "9f0e...")],
      responsesExtra: { "201": { description: "Created", ...j(ref("Deal")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/offers/{id}/decline": {
    post: op({
      summary: "Decline an offer",
      tags: ["Offers"],
      params: [pathParam("id", "9f0e...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("DirectOffer")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },

  "/deals/mine": {
    get: op({
      summary: "List your deals (as client or creator) — added, not in the original spec",
      tags: ["Deals"],
      responsesExtra: { "200": { description: "OK", ...j(arrayOf("Deal")) } },
    }),
  },
  "/deals/{id}": {
    get: op({
      summary: "Get a deal — added, not in the original spec",
      tags: ["Deals"],
      params: [pathParam("id", "d41a...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Deal")) }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
  },
  "/deals/{id}/cancel": {
    post: op({
      summary: "Cancel a deal — only while negotiating/agreement_pending. Added: the state machine defines `cancelled` but no endpoint reached it",
      tags: ["Deals"],
      params: [pathParam("id", "d41a...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Deal")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/deals/{id}/agreement": {
    post: op({
      summary: "Set deal terms (client) — moves the deal negotiating -> agreement_pending",
      tags: ["Agreement"],
      params: [pathParam("id", "d41a...")],
      body: {
        schema: {
          type: "object",
          properties: {
            usage_rights: { type: "string", enum: ["organic", "paid_ads", "whitelisting"] },
            live_duration_days: { type: "integer" },
            approval_required: { type: "boolean" },
            min_views: { type: "integer", nullable: true },
          },
          required: ["usage_rights", "live_duration_days", "approval_required"],
        },
        example: { usage_rights: "paid_ads", live_duration_days: 60, approval_required: true, min_views: null },
      },
      responsesExtra: { "201": { description: "Created", ...j(ref("Agreement")) } },
    }),
    get: op({
      summary: "Get the deal's agreement terms",
      tags: ["Agreement"],
      params: [pathParam("id", "d41a...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Agreement")) }, "404": { $ref: "#/components/responses/NotFound" } },
    }),
  },
  "/deals/{id}/agreement/consent": {
    post: op({
      summary: "Creator consents to the terms — the hard gate; consented must be literal boolean true",
      tags: ["Agreement"],
      params: [pathParam("id", "d41a...")],
      body: { schema: { type: "object", properties: { consented: { type: "boolean" } }, required: ["consented"] }, example: { consented: true } },
      responsesExtra: {
        "200": { description: "OK", ...j(ref("Agreement")) },
        "400": errorResponse("consented wasn't literal true, or the client hasn't set terms yet", { error: "consented must be true" }),
      },
    }),
  },

  "/deals/{id}/fund": {
    post: op({
      summary: "Fund escrow (client) — real Stripe manual-capture PaymentIntent before any DB write",
      tags: ["Escrow & Payments"],
      params: [pathParam("id", "d41a...")],
      body: { schema: { type: "object", properties: { payment_method_id: { type: "string", format: "uuid" } }, required: ["payment_method_id"] } },
      responsesExtra: {
        "200": { description: "OK", ...j(ref("Escrow")) },
        "400": errorResponse("Creator hasn't consented yet (rule 1, re-checked here)", { error: "Creator has not consented to the agreement yet" }),
        "501": { $ref: "#/components/responses/NotConfigured" },
      },
    }),
  },
  "/deals/{id}/mark-live": {
    post: op({
      summary: "Mark content live (creator) — starts the payout countdown",
      tags: ["Escrow & Payments"],
      params: [pathParam("id", "d41a...")],
      body: { schema: { type: "object", properties: { live_url: { type: "string" } } } },
      responsesExtra: { "200": { description: "OK", ...j(ref("Escrow")) } },
    }),
  },
  "/internal/escrow/release-due-payouts": {
    post: {
      summary: "Cron-only: release payouts for escrows past their live-duration window",
      description: "Not JWT-gated. Requires header `X-Internal-Secret: <INTERNAL_API_SECRET>`.",
      tags: ["Escrow & Payments"],
      security: [{ internalSecret: [] }],
      responses: {
        "200": { description: "OK", ...j(ref("ReleaseDuePayoutsSummary")) },
        "401": errorResponse("Missing/wrong X-Internal-Secret", { error: "Invalid internal secret" }),
        "501": { $ref: "#/components/responses/NotConfigured" },
      },
    },
  },
  "/transactions/mine": {
    get: op({ summary: "List your transactions", tags: ["Escrow & Payments"], responsesExtra: { "200": { description: "OK", ...j(arrayOf("Transaction")) } } }),
  },
  "/payment-methods": {
    post: op({
      summary: "Attach a card (client confirms a Stripe SetupIntent first; card data never touches this API)",
      tags: ["Escrow & Payments"],
      body: { schema: { type: "object", properties: { payment_method_id: { type: "string" } }, required: ["payment_method_id"] }, example: { payment_method_id: "pm_1P..." } },
      responsesExtra: { "201": { description: "Created", ...j(ref("PaymentMethod")) }, "501": { $ref: "#/components/responses/NotConfigured" } },
    }),
    get: op({ summary: "List saved payment methods", tags: ["Escrow & Payments"], responsesExtra: { "200": { description: "OK", ...j(arrayOf("PaymentMethod")) } } }),
  },
  "/payout-methods": {
    post: op({
      summary: "Start Stripe Connect Express onboarding",
      tags: ["Escrow & Payments"],
      body: { schema: { type: "object", properties: { schedule: { type: "string", enum: ["weekly", "biweekly"] } } }, example: { schedule: "weekly" } },
      responsesExtra: {
        "201": { description: "Created", ...j({ type: "object", properties: { payout_method: ref("PayoutMethod"), onboarding_url: { type: "string" } } }) },
        "501": { $ref: "#/components/responses/NotConfigured" },
      },
    }),
    get: op({ summary: "List payout methods", tags: ["Escrow & Payments"], responsesExtra: { "200": { description: "OK", ...j(arrayOf("PayoutMethod")) } } }),
  },

  "/deals/{id}/drafts": {
    post: op({
      summary: "Submit a draft (creator) — file_url from a pre-signed S3 upload",
      tags: ["Drafts"],
      params: [pathParam("id", "d41a...")],
      body: { schema: { type: "object", properties: { file_url: { type: "string" }, note: { type: "string" } }, required: ["file_url"] } },
      responsesExtra: { "201": { description: "Created", ...j(ref("Draft")) } },
    }),
    get: op({
      summary: "List a deal's draft submission history",
      tags: ["Drafts"],
      params: [pathParam("id", "d41a...")],
      responsesExtra: { "200": { description: "OK", ...j(arrayOf("Draft")) } },
    }),
  },
  "/drafts/{id}/approve": {
    post: op({
      summary: "Approve a draft (client)",
      tags: ["Drafts"],
      params: [pathParam("id", "c9d1...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Draft")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/drafts/{id}/request-changes": {
    post: op({
      summary: "Request changes on a draft (client) — never touches the Agreement (rule 5)",
      tags: ["Drafts"],
      params: [pathParam("id", "c9d1...")],
      body: { schema: { type: "object", properties: { feedback: { type: "string" } }, required: ["feedback"] } },
      responsesExtra: { "200": { description: "OK", ...j(ref("Draft")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/deals/{id}/review": {
    post: op({
      summary: "Leave a review — only once Deal.status = completed (rule 7)",
      tags: ["Reviews"],
      params: [pathParam("id", "d41a...")],
      body: {
        schema: {
          type: "object",
          properties: { rating: { type: "integer", minimum: 1, maximum: 5 }, tags: { type: "array", items: { type: "string" } }, comment: { type: "string" } },
          required: ["rating"],
        },
        example: { rating: 5, tags: ["great_communication", "on_time"], comment: "Would book again." },
      },
      responsesExtra: { "201": { description: "Created", ...j(ref("Review")) }, "409": { $ref: "#/components/responses/Conflict" } },
    }),
  },
  "/users/{id}/reviews": {
    get: op({
      summary: "Get a user's aggregate rating + review list",
      tags: ["Reviews"],
      params: [pathParam("id", "5b1f7c2e-...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("ReviewsForUser")) } },
    }),
  },

  "/threads": {
    get: op({ summary: "List your message threads", tags: ["Messaging"], responsesExtra: { "200": { description: "OK", ...j(arrayOf("Thread")) } } }),
  },
  "/threads/{id}/messages": {
    get: op({
      summary: "List a thread's messages (cursor-paginated, newest first)",
      tags: ["Messaging"],
      params: [pathParam("id", "t1a2..."), queryParam("before", "string", undefined, "Message id cursor")],
      responsesExtra: { "200": { description: "OK", ...j(arrayOf("Message")) }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
    post: op({
      summary: "Send a message (text and/or attachment_url — at least one required)",
      tags: ["Messaging"],
      params: [pathParam("id", "t1a2...")],
      body: { schema: { type: "object", properties: { text: { type: "string" }, attachment_url: { type: "string" } } }, example: { text: "Sure, send me the terms" } },
      responsesExtra: { "201": { description: "Created", ...j(ref("Message")) } },
    }),
  },

  "/notifications": {
    get: op({
      summary: "List notifications",
      tags: ["Notifications"],
      params: [queryParam("unread_only", "boolean", true)],
      responsesExtra: { "200": { description: "OK", ...j(arrayOf("Notification")) } },
    }),
  },
  "/notifications/{id}/read": {
    post: op({
      summary: "Mark a notification read",
      tags: ["Notifications"],
      params: [pathParam("id", "...")],
      responsesExtra: { "200": { description: "OK", ...j(ref("Notification")) }, "403": { $ref: "#/components/responses/Forbidden" } },
    }),
  },
  "/push-tokens": {
    post: op({
      summary: "Register a device push token (FCM/APNs)",
      tags: ["Notifications"],
      body: { schema: { type: "object", properties: { platform: { type: "string" }, token: { type: "string" } }, required: ["platform", "token"] } },
      responsesExtra: { "201": { description: "Created", ...j(ref("PushToken")) } },
    }),
  },

  "/me": {
    get: op({ summary: "Get the current user", tags: ["Settings"], responsesExtra: { "200": { description: "OK", ...j(ref("User")) } } }),
    patch: op({
      summary: "Update avatar_url and/or notification_prefs",
      tags: ["Settings"],
      body: {
        schema: { type: "object", properties: { avatar_url: { type: "string" }, notification_prefs: { type: "object" } } },
        example: { avatar_url: "https://...", notification_prefs: { push: true, email_digest: false } },
      },
      responsesExtra: { "200": { description: "OK", ...j(ref("User")) } },
    }),
  },
};

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Vouch API",
    version: "0.1.0",
    description:
      "Two-sided marketplace: clients post briefs/send direct offers, creators bid/negotiate, both consent to terms before escrow funds, then draft -> approve -> live -> payout. " +
      "Generated from the actual implementation in `src/` — every schema/example here is what the code returns, not a re-statement of the original spec. " +
      "See `API.md` in the repo for the same content with prose explanations of every gap found between the original spec and the design files.",
    contact: { name: "parth0072/VouchBE", url: "https://github.com/parth0072/VouchBE" },
  },
  servers: [
    { url: "https://alphabyteinnovation.com/vouch", description: "Production" },
    { url: "http://localhost:4000", description: "Local dev" },
  ],
  tags: [
    { name: "Auth" }, { name: "Onboarding" }, { name: "Briefs" }, { name: "Bids" }, { name: "Creators" },
    { name: "Offers" }, { name: "Deals" }, { name: "Agreement" }, { name: "Escrow & Payments" },
    { name: "Drafts" }, { name: "Reviews" }, { name: "Messaging" }, { name: "Notifications" }, { name: "Settings" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      internalSecret: { type: "apiKey", in: "header", name: "X-Internal-Secret" },
    },
    schemas,
    responses,
  },
  paths,
};

process.stdout.write(JSON.stringify(spec, null, 2) + "\n");
