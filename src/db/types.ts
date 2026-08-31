import type { ColumnType, Generated } from "kysely";

// Mirrors prisma/migrations/20260819055652_init/migration.sql — that SQL is
// the actual source of truth now (already applied to production via
// phpMyAdmin), not a schema file Kysely generates from.
//
// Property names here are camelCase, matching how the rest of the app queries
// and consumes them — CamelCasePlugin (db/index.ts) translates to/from the
// real snake_case DB columns at the SQL/result level, so this interface needs
// to describe the camelCase side of that translation, not the raw columns.
//
// Money/rating columns: DECIMAL, typed as ColumnType<string, number, number> —
// mysql2 returns these as fixed-scale strings by default (no trailing-zero
// stripping like Prisma's decimal.js had), accepts a plain number on write.
// Boolean columns: MySQL BOOLEAN is TINYINT(1); db/index.ts's typeCast maps it
// to a real JS boolean explicitly rather than relying on driver defaults.

type Id = string;
type Decimal = ColumnType<string, number, number>;
// Generated<ColumnType<...>> doesn't resolve correctly for .set()/.values()
// with Kysely — wrapping "optional on insert" directly into the ColumnType's
// insert parameter (instead of nesting Generated<> around it) is what actually
// works. Only needed for avg_rating, the one Decimal column with a DB default.
type DecimalWithDefault = ColumnType<string, number | undefined, number>;
// Select gives back the parsed value (mysql2 auto-parses JSON columns on the
// way out) — but insert/update need an actual JSON string, not a raw JS
// object/array; a live test caught mysql2 producing malformed SQL/"Invalid
// JSON text" without an explicit JSON.stringify() at every write site.
type Json<T> = ColumnType<T, string, string>;

export interface UsersTable {
  id: Id;
  email: string;
  passwordHash: string | null;
  oauthProviders: Json<unknown> | null;
  activeRole: "client" | "creator";
  hasClientProfile: Generated<boolean>;
  hasCreatorProfile: Generated<boolean>;
  notificationPrefs: Json<Record<string, unknown>> | null;
  // db/migrations/002 — name + email verification for the 3-step signup
  // flow. name is nullable: optional in POST /auth/signup, not every caller
  // sends it. verificationCode/ExpiresAt hold only the one currently-active
  // code (overwritten by each new send, cleared on successful verify).
  name: string | null;
  // Always writable, even before a client_profiles/creator_profiles row
  // exists (the photo step precedes role-select) — settings.service.ts also
  // syncs this into whichever profile row(s) exist, since that's still what
  // creator search/bids/etc. actually read for display.
  avatarUrl: string | null;
  emailVerifiedAt: Date | null;
  verificationCode: string | null;
  verificationCodeExpiresAt: Date | null;
  createdAt: Generated<Date>;
  updatedAt: Date;
}

export interface ClientProfilesTable {
  userId: Id;
  companyName: string | null;
  avatarUrl: string | null;
}

export interface CreatorProfilesTable {
  userId: Id;
  name: string | null;
  bio: string | null;
  niches: Json<string[]> | null;
  startingRate: Decimal | null;
  typicalTurnaroundDays: number | null;
  avatarUrl: string | null;
  avgRating: DecimalWithDefault;
  reviewCount: Generated<number>;
}

export interface SocialAccountsTable {
  id: Id;
  creatorId: Id;
  platform: "instagram" | "tiktok" | "youtube" | "facebook";
  handle: string;
  followerCount: number;
  engagementRate: Decimal | null;
  verified: Generated<boolean>;
  oauthTokenRef: string | null;
  lastSyncedAt: Date | null;
}

export interface PortfolioItemsTable {
  id: Id;
  creatorId: Id;
  mediaUrl: string;
  sortOrder: Generated<number>;
}

export type BriefFormat = "reel" | "ugc" | "youtube" | "tiktok" | "photo";
export type BriefStatus = "open" | "in_progress" | "completed" | "cancelled";

export interface BriefsTable {
  id: Id;
  clientId: Id;
  title: string;
  format: BriefFormat;
  niche: string;
  description: string;
  budgetMin: Decimal;
  budgetMax: Decimal;
  deadline: Date;
  status: Generated<BriefStatus>;
  createdAt: Generated<Date>;
}

export interface ReferenceImagesTable {
  id: Id;
  briefId: Id;
  imageUrl: string;
}

export interface BidsTable {
  id: Id;
  briefId: Id;
  creatorId: Id;
  price: Decimal;
  deliveryDays: number;
  note: string | null;
  status: Generated<"pending" | "accepted" | "declined">;
  createdAt: Generated<Date>;
}

export interface DirectOffersTable {
  id: Id;
  clientId: Id;
  creatorId: Id;
  briefId: Id | null;
  price: Decimal;
  format: BriefFormat;
  turnaroundDays: number;
  message: string | null;
  status: Generated<"pending" | "countered" | "accepted" | "declined">;
  createdAt: Generated<Date>;
}

export interface OfferRevisionsTable {
  id: Id;
  offerId: Id;
  proposedBy: "client" | "creator";
  price: Decimal;
  turnaroundDays: number;
  note: string | null;
  createdAt: Generated<Date>;
}

export type DealStatus =
  | "negotiating"
  | "agreement_pending"
  | "escrow_funded"
  | "in_production"
  | "draft_submitted"
  | "changes_requested"
  | "approved"
  | "live"
  | "completed"
  | "cancelled";

export interface DealsTable {
  id: Id;
  clientId: Id;
  creatorId: Id;
  briefId: Id | null;
  offerId: Id | null;
  source: "bid" | "direct_offer";
  agreedPrice: Decimal;
  status: Generated<DealStatus>;
  createdAt: Generated<Date>;
  updatedAt: Date;
}

export interface AgreementsTable {
  id: Id;
  dealId: Id;
  usageRights: "organic" | "paid_ads" | "whitelisting";
  liveDurationDays: number;
  approvalRequired: boolean;
  minViews: number | null;
  clientConsentedAt: Date | null;
  creatorConsentedAt: Date | null;
}

export interface DraftsTable {
  id: Id;
  dealId: Id;
  fileUrl: string;
  note: string | null;
  status: Generated<"submitted" | "approved" | "changes_requested">;
  submittedAt: Generated<Date>;
  reviewedAt: Date | null;
  clientFeedback: string | null;
}

export interface EscrowsTable {
  id: Id;
  dealId: Id;
  amount: Decimal;
  fundedAt: Date | null;
  liveStartedAt: Date | null;
  liveUrl: string | null;
  payoutReleasedAt: Date | null;
  status: Generated<"unfunded" | "held" | "released" | "refunded">;
}

export interface PaymentMethodsTable {
  id: Id;
  clientId: Id;
  providerToken: string;
  brand: string;
  last4: string;
  isDefault: Generated<boolean>;
}

export interface PayoutMethodsTable {
  id: Id;
  creatorId: Id;
  provider: "stripe_connect";
  accountRef: string;
  schedule: "weekly" | "biweekly";
}

export interface TransactionsTable {
  id: Id;
  userId: Id;
  dealId: Id;
  type: "escrow_fund" | "payout" | "refund";
  amount: Decimal;
  status: Generated<"pending" | "succeeded" | "failed">;
  providerRef: string | null;
  createdAt: Generated<Date>;
}

export interface ThreadsTable {
  id: Id;
  participantAId: Id;
  participantBId: Id;
  dealId: Id | null;
  briefId: Id | null;
}

export interface MessagesTable {
  id: Id;
  threadId: Id;
  senderId: Id;
  text: string | null;
  attachmentUrl: string | null;
  systemEvent: string | null;
  createdAt: Generated<Date>;
  readAt: Date | null;
}

export interface NotificationsTable {
  id: Id;
  userId: Id;
  type: string;
  payload: Json<Record<string, unknown>>;
  readAt: Date | null;
  createdAt: Generated<Date>;
}

export interface ReviewsTable {
  id: Id;
  dealId: Id;
  reviewerId: Id;
  revieweeId: Id;
  rating: number;
  tags: Json<string[]>;
  comment: string | null;
  createdAt: Generated<Date>;
}

export interface PushTokensTable {
  id: Id;
  userId: Id;
  platform: string;
  token: string;
  createdAt: Generated<Date>;
}

export interface Database {
  users: UsersTable;
  clientProfiles: ClientProfilesTable;
  creatorProfiles: CreatorProfilesTable;
  socialAccounts: SocialAccountsTable;
  portfolioItems: PortfolioItemsTable;
  briefs: BriefsTable;
  referenceImages: ReferenceImagesTable;
  bids: BidsTable;
  directOffers: DirectOffersTable;
  offerRevisions: OfferRevisionsTable;
  deals: DealsTable;
  agreements: AgreementsTable;
  drafts: DraftsTable;
  escrows: EscrowsTable;
  paymentMethods: PaymentMethodsTable;
  payoutMethods: PayoutMethodsTable;
  transactions: TransactionsTable;
  threads: ThreadsTable;
  messages: MessagesTable;
  notifications: NotificationsTable;
  reviews: ReviewsTable;
  pushTokens: PushTokensTable;
}
