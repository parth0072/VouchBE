
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('@prisma/client/runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  oauthProviders: 'oauthProviders',
  activeRole: 'activeRole',
  hasClientProfile: 'hasClientProfile',
  hasCreatorProfile: 'hasCreatorProfile',
  notificationPrefs: 'notificationPrefs',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientProfileScalarFieldEnum = {
  userId: 'userId',
  companyName: 'companyName',
  avatarUrl: 'avatarUrl'
};

exports.Prisma.CreatorProfileScalarFieldEnum = {
  userId: 'userId',
  name: 'name',
  bio: 'bio',
  niches: 'niches',
  startingRate: 'startingRate',
  typicalTurnaroundDays: 'typicalTurnaroundDays',
  avatarUrl: 'avatarUrl',
  avgRating: 'avgRating',
  reviewCount: 'reviewCount'
};

exports.Prisma.SocialAccountScalarFieldEnum = {
  id: 'id',
  creatorId: 'creatorId',
  platform: 'platform',
  handle: 'handle',
  followerCount: 'followerCount',
  engagementRate: 'engagementRate',
  verified: 'verified',
  oauthTokenRef: 'oauthTokenRef',
  lastSyncedAt: 'lastSyncedAt'
};

exports.Prisma.PortfolioItemScalarFieldEnum = {
  id: 'id',
  creatorId: 'creatorId',
  mediaUrl: 'mediaUrl',
  sortOrder: 'sortOrder'
};

exports.Prisma.BriefScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  title: 'title',
  format: 'format',
  niche: 'niche',
  description: 'description',
  budgetMin: 'budgetMin',
  budgetMax: 'budgetMax',
  deadline: 'deadline',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.ReferenceImageScalarFieldEnum = {
  id: 'id',
  briefId: 'briefId',
  imageUrl: 'imageUrl'
};

exports.Prisma.BidScalarFieldEnum = {
  id: 'id',
  briefId: 'briefId',
  creatorId: 'creatorId',
  price: 'price',
  deliveryDays: 'deliveryDays',
  note: 'note',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.DirectOfferScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  creatorId: 'creatorId',
  briefId: 'briefId',
  price: 'price',
  format: 'format',
  turnaroundDays: 'turnaroundDays',
  message: 'message',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.OfferRevisionScalarFieldEnum = {
  id: 'id',
  offerId: 'offerId',
  proposedBy: 'proposedBy',
  price: 'price',
  turnaroundDays: 'turnaroundDays',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.DealScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  creatorId: 'creatorId',
  briefId: 'briefId',
  offerId: 'offerId',
  source: 'source',
  agreedPrice: 'agreedPrice',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AgreementScalarFieldEnum = {
  id: 'id',
  dealId: 'dealId',
  usageRights: 'usageRights',
  liveDurationDays: 'liveDurationDays',
  approvalRequired: 'approvalRequired',
  minViews: 'minViews',
  clientConsentedAt: 'clientConsentedAt',
  creatorConsentedAt: 'creatorConsentedAt'
};

exports.Prisma.DraftScalarFieldEnum = {
  id: 'id',
  dealId: 'dealId',
  fileUrl: 'fileUrl',
  note: 'note',
  status: 'status',
  submittedAt: 'submittedAt',
  reviewedAt: 'reviewedAt',
  clientFeedback: 'clientFeedback'
};

exports.Prisma.EscrowScalarFieldEnum = {
  id: 'id',
  dealId: 'dealId',
  amount: 'amount',
  fundedAt: 'fundedAt',
  liveStartedAt: 'liveStartedAt',
  liveUrl: 'liveUrl',
  payoutReleasedAt: 'payoutReleasedAt',
  status: 'status'
};

exports.Prisma.PaymentMethodScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  providerToken: 'providerToken',
  brand: 'brand',
  last4: 'last4',
  isDefault: 'isDefault'
};

exports.Prisma.PayoutMethodScalarFieldEnum = {
  id: 'id',
  creatorId: 'creatorId',
  provider: 'provider',
  accountRef: 'accountRef',
  schedule: 'schedule'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  dealId: 'dealId',
  type: 'type',
  amount: 'amount',
  status: 'status',
  providerRef: 'providerRef',
  createdAt: 'createdAt'
};

exports.Prisma.ThreadScalarFieldEnum = {
  id: 'id',
  participantAId: 'participantAId',
  participantBId: 'participantBId',
  dealId: 'dealId',
  briefId: 'briefId'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  threadId: 'threadId',
  senderId: 'senderId',
  text: 'text',
  attachmentUrl: 'attachmentUrl',
  systemEvent: 'systemEvent',
  createdAt: 'createdAt',
  readAt: 'readAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  payload: 'payload',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  dealId: 'dealId',
  reviewerId: 'reviewerId',
  revieweeId: 'revieweeId',
  rating: 'rating',
  tags: 'tags',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.PushTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  platform: 'platform',
  token: 'token',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  client: 'client',
  creator: 'creator'
};

exports.SocialPlatform = exports.$Enums.SocialPlatform = {
  instagram: 'instagram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  facebook: 'facebook'
};

exports.BriefFormat = exports.$Enums.BriefFormat = {
  reel: 'reel',
  ugc: 'ugc',
  youtube: 'youtube',
  tiktok: 'tiktok',
  photo: 'photo'
};

exports.BriefStatus = exports.$Enums.BriefStatus = {
  open: 'open',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.BidStatus = exports.$Enums.BidStatus = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined'
};

exports.OfferStatus = exports.$Enums.OfferStatus = {
  pending: 'pending',
  countered: 'countered',
  accepted: 'accepted',
  declined: 'declined'
};

exports.ProposedBy = exports.$Enums.ProposedBy = {
  client: 'client',
  creator: 'creator'
};

exports.DealSource = exports.$Enums.DealSource = {
  bid: 'bid',
  direct_offer: 'direct_offer'
};

exports.DealStatus = exports.$Enums.DealStatus = {
  negotiating: 'negotiating',
  agreement_pending: 'agreement_pending',
  escrow_funded: 'escrow_funded',
  in_production: 'in_production',
  draft_submitted: 'draft_submitted',
  changes_requested: 'changes_requested',
  approved: 'approved',
  live: 'live',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.UsageRights = exports.$Enums.UsageRights = {
  organic: 'organic',
  paid_ads: 'paid_ads',
  whitelisting: 'whitelisting'
};

exports.DraftStatus = exports.$Enums.DraftStatus = {
  submitted: 'submitted',
  approved: 'approved',
  changes_requested: 'changes_requested'
};

exports.EscrowStatus = exports.$Enums.EscrowStatus = {
  unfunded: 'unfunded',
  held: 'held',
  released: 'released',
  refunded: 'refunded'
};

exports.PayoutProvider = exports.$Enums.PayoutProvider = {
  stripe_connect: 'stripe_connect'
};

exports.PayoutSchedule = exports.$Enums.PayoutSchedule = {
  weekly: 'weekly',
  biweekly: 'biweekly'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  escrow_fund: 'escrow_fund',
  payout: 'payout',
  refund: 'refund'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed'
};

exports.Prisma.ModelName = {
  User: 'User',
  ClientProfile: 'ClientProfile',
  CreatorProfile: 'CreatorProfile',
  SocialAccount: 'SocialAccount',
  PortfolioItem: 'PortfolioItem',
  Brief: 'Brief',
  ReferenceImage: 'ReferenceImage',
  Bid: 'Bid',
  DirectOffer: 'DirectOffer',
  OfferRevision: 'OfferRevision',
  Deal: 'Deal',
  Agreement: 'Agreement',
  Draft: 'Draft',
  Escrow: 'Escrow',
  PaymentMethod: 'PaymentMethod',
  PayoutMethod: 'PayoutMethod',
  Transaction: 'Transaction',
  Thread: 'Thread',
  Message: 'Message',
  Notification: 'Notification',
  Review: 'Review',
  PushToken: 'PushToken'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/coda/Desktop/Vouch from Google Drive/BE/node_modules/@prisma/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-3.0.x"
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/Users/coda/Desktop/Vouch from Google Drive/BE/prisma/schema.prisma"
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "mysql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// Transcribed from \"Vouch - Backend Requirements.md\" §2, adapted from the doc's\n// Postgres-flavored types to MySQL (the doc explicitly says to adjust to whatever\n// the team standardizes on):\n//   - uuid PK/FK      -> String @db.Char(36), app-generated via default(uuid())\n//   - jsonb           -> Json\n//   - text[]          -> Json array, EXCEPT where the doc's §2.5 vocabulary table\n//                        marks the list closed (no \"extend as needed\" note) — those\n//                        stay as native Prisma/MySQL enums (see BriefFormat,\n//                        SocialPlatform, UsageRights). Open vocabularies (creator\n//                        niches, review tags) and Notification.type (documented with\n//                        a trailing \"...\" — open-ended by design) are Json/String so\n//                        new values don't require a migration.\n//   - numeric(p,s)    -> Decimal @db.Decimal(p,s)\n//   - timestamptz     -> DateTime (MySQL has no tz-aware type; store/interpret as UTC)\n//   - Thread.participant_ids uuid[] (exactly 2, v1 is 1:1 only) -> two explicit FK\n//     columns (participantAId/participantBId) so referential integrity is enforced;\n//     MySQL/Prisma can't FK-constrain elements inside a JSON array.\n\ngenerator client {\n  provider      = \"prisma-client-js\"\n  // \"native\" keeps local dev working (auto-detects the dev machine's OS).\n  // \"rhel-openssl-3.0.x\" targets the cPanel/CloudLinux production host:\n  // x86_64, OpenSSL 3.x, no /etc/os-release (consistent with CloudLinux's\n  // CageFS jail) — cPanel hosts are overwhelmingly RHEL-family (CloudLinux\n  // itself is a RHEL derivative). Without this, npm install's postinstall\n  // (`prisma generate`) downloads whatever binary its own OS-detection\n  // guesses, which crashed with SIGABRT on that host.\n  binaryTargets = [\"native\", \"rhel-openssl-3.0.x\"]\n}\n\ndatasource db {\n  provider = \"mysql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ---------- 2.1 User & profiles ----------\n\nenum Role {\n  client\n  creator\n}\n\nmodel User {\n  id                String   @id @default(uuid()) @db.Char(36)\n  email             String   @unique @db.VarChar(320)\n  passwordHash      String?  @map(\"password_hash\")\n  oauthProviders    Json?    @map(\"oauth_providers\")\n  activeRole        Role     @map(\"active_role\")\n  hasClientProfile  Boolean  @default(false) @map(\"has_client_profile\")\n  hasCreatorProfile Boolean  @default(false) @map(\"has_creator_profile\")\n  // Not in §2.1's table — PATCH /me (§3.13) takes `notification_prefs` in its\n  // body (screen 26's push/email toggles) with nowhere documented to persist\n  // it. Shape is intentionally loose (Json, e.g. {push, email_digest}) rather\n  // than fixed columns, since screen 26 is the only place it's specified.\n  notificationPrefs Json?    @map(\"notification_prefs\")\n  createdAt         DateTime @default(now()) @map(\"created_at\")\n  updatedAt         DateTime @updatedAt @map(\"updated_at\")\n\n  clientProfile   ClientProfile?\n  creatorProfile  CreatorProfile?\n  sentMessages    Message[]       @relation(\"MessageSender\")\n  notifications   Notification[]\n  reviewsWritten  Review[]        @relation(\"ReviewReviewer\")\n  reviewsReceived Review[]        @relation(\"ReviewReviewee\")\n  transactions    Transaction[]\n  threadsAsA      Thread[]        @relation(\"ThreadParticipantA\")\n  threadsAsB      Thread[]        @relation(\"ThreadParticipantB\")\n  pushTokens      PushToken[]\n\n  @@map(\"users\")\n}\n\n// companyName is nullable despite §2.1 not marking it so: POST /auth/role (§3.1)\n// creates this row on first switch to `client`, before onboarding has collected\n// a company name.\nmodel ClientProfile {\n  userId      String  @id @map(\"user_id\") @db.Char(36)\n  companyName String? @map(\"company_name\")\n  avatarUrl   String? @map(\"avatar_url\")\n\n  user           User            @relation(fields: [userId], references: [id])\n  briefs         Brief[]\n  directOffers   DirectOffer[]\n  deals          Deal[]\n  paymentMethods PaymentMethod[]\n\n  @@map(\"client_profiles\")\n}\n\n// is_verified is deliberately NOT a column here — business rule §4.2: \"derived,\n// not stored\" (at least one SocialAccount.verified = true). Compute on read.\n//\n// `name` isn't in §2.1's table at all — a real gap, not just an adaptation.\n// Every screen that shows a creator (03, 09, 13, 15-19, 21...) shows a personal\n// name, and ClientProfile has company_name for the same purpose on the other\n// side, but CreatorProfile had no equivalent field to hold one. Added here,\n// mirroring company_name.\n//\n// niches/startingRate/typicalTurnaroundDays are nullable despite §2.1 not marking\n// them so, for the same reason as ClientProfile.companyName above: POST /auth/role\n// creates this row on first switch to `creator`, before onboarding (screens 06-08)\n// has collected any of it. \"Finish & go live\" (screen 08) is the point these are\n// expected to all be non-null — enforce that in the onboarding-completion endpoint,\n// not the schema.\nmodel CreatorProfile {\n  userId                String   @id @map(\"user_id\") @db.Char(36)\n  name                  String?\n  bio                   String?  @db.Text\n  niches                Json? // string[] against the controlled vocab in §2.5 — extend in app code, not schema\n  startingRate          Decimal? @map(\"starting_rate\") @db.Decimal(10, 2)\n  typicalTurnaroundDays Int?     @map(\"typical_turnaround_days\")\n  avatarUrl             String?  @map(\"avatar_url\")\n  avgRating             Decimal  @default(0) @map(\"avg_rating\") @db.Decimal(2, 1)\n  reviewCount           Int      @default(0) @map(\"review_count\")\n\n  user           User            @relation(fields: [userId], references: [id])\n  socialAccounts SocialAccount[]\n  portfolioItems PortfolioItem[]\n  bids           Bid[]\n  directOffers   DirectOffer[]\n  deals          Deal[]\n  payoutMethods  PayoutMethod[]\n\n  @@map(\"creator_profiles\")\n}\n\nenum SocialPlatform {\n  instagram\n  tiktok\n  youtube\n  facebook\n}\n\nmodel SocialAccount {\n  id             String         @id @default(uuid()) @db.Char(36)\n  creatorId      String         @map(\"creator_id\") @db.Char(36)\n  platform       SocialPlatform\n  handle         String\n  followerCount  Int            @map(\"follower_count\")\n  engagementRate Decimal?       @map(\"engagement_rate\") @db.Decimal(5, 2)\n  verified       Boolean        @default(false)\n  oauthTokenRef  String?        @map(\"oauth_token_ref\") @db.Text\n  lastSyncedAt   DateTime?      @map(\"last_synced_at\")\n\n  creator CreatorProfile @relation(fields: [creatorId], references: [userId], onDelete: Cascade)\n\n  @@unique([creatorId, platform])\n  @@map(\"social_accounts\")\n}\n\nmodel PortfolioItem {\n  id        String @id @default(uuid()) @db.Char(36)\n  creatorId String @map(\"creator_id\") @db.Char(36)\n  mediaUrl  String @map(\"media_url\")\n  sortOrder Int    @default(0) @map(\"sort_order\")\n\n  creator CreatorProfile @relation(fields: [creatorId], references: [userId], onDelete: Cascade)\n\n  @@map(\"portfolio_items\")\n}\n\n// ---------- 2.2 Briefs, bids, offers ----------\n\nenum BriefFormat {\n  reel\n  ugc\n  youtube\n  tiktok\n  photo\n}\n\nenum BriefStatus {\n  open\n  in_progress\n  completed\n  cancelled\n}\n\n// `niche` isn't in the doc's §2.2 table, only `format` — but §3.3's own feed\n// query takes `?niche=`, and every brief card in the UI kit (screens 03/30) shows\n// a two-part tag (\"REEL · BEAUTY\", \"PHOTO · PRODUCT\" — format · niche together).\n// Added to close that gap; validated against the same open vocabulary as\n// CreatorProfile.niches (see lib/vocabularies.ts), not a native enum.\nmodel Brief {\n  id          String      @id @default(uuid()) @db.Char(36)\n  clientId    String      @map(\"client_id\") @db.Char(36)\n  title       String\n  format      BriefFormat\n  niche       String\n  description String      @db.Text\n  budgetMin   Decimal     @map(\"budget_min\") @db.Decimal(10, 2)\n  budgetMax   Decimal     @map(\"budget_max\") @db.Decimal(10, 2)\n  deadline    DateTime    @db.Date\n  status      BriefStatus @default(open)\n  createdAt   DateTime    @default(now()) @map(\"created_at\")\n\n  client          ClientProfile    @relation(fields: [clientId], references: [userId])\n  referenceImages ReferenceImage[]\n  bids            Bid[]\n  directOffers    DirectOffer[]\n  deals           Deal[]\n  threads         Thread[]\n\n  @@index([status])\n  @@index([clientId, status])\n  @@map(\"briefs\")\n}\n\nmodel ReferenceImage {\n  id       String @id @default(uuid()) @db.Char(36)\n  briefId  String @map(\"brief_id\") @db.Char(36)\n  imageUrl String @map(\"image_url\")\n\n  brief Brief @relation(fields: [briefId], references: [id], onDelete: Cascade)\n\n  @@map(\"reference_images\")\n}\n\nenum BidStatus {\n  pending\n  accepted\n  declined\n}\n\nmodel Bid {\n  id           String    @id @default(uuid()) @db.Char(36)\n  briefId      String    @map(\"brief_id\") @db.Char(36)\n  creatorId    String    @map(\"creator_id\") @db.Char(36)\n  price        Decimal   @db.Decimal(10, 2)\n  deliveryDays Int       @map(\"delivery_days\")\n  note         String?   @db.Text\n  status       BidStatus @default(pending)\n  createdAt    DateTime  @default(now()) @map(\"created_at\")\n\n  brief   Brief          @relation(fields: [briefId], references: [id])\n  creator CreatorProfile @relation(fields: [creatorId], references: [userId])\n\n  @@unique([briefId, creatorId])\n  @@map(\"bids\")\n}\n\nenum OfferStatus {\n  pending\n  countered\n  accepted\n  declined\n}\n\nmodel DirectOffer {\n  id             String      @id @default(uuid()) @db.Char(36)\n  clientId       String      @map(\"client_id\") @db.Char(36)\n  creatorId      String      @map(\"creator_id\") @db.Char(36)\n  briefId        String?     @map(\"brief_id\") @db.Char(36)\n  price          Decimal     @db.Decimal(10, 2)\n  format         BriefFormat\n  turnaroundDays Int         @map(\"turnaround_days\")\n  message        String?     @db.Text\n  status         OfferStatus @default(pending)\n  createdAt      DateTime    @default(now()) @map(\"created_at\")\n\n  client    ClientProfile   @relation(fields: [clientId], references: [userId])\n  creator   CreatorProfile  @relation(fields: [creatorId], references: [userId])\n  brief     Brief?          @relation(fields: [briefId], references: [id])\n  revisions OfferRevision[]\n  deals     Deal[]\n\n  @@map(\"direct_offers\")\n}\n\nenum ProposedBy {\n  client\n  creator\n}\n\nmodel OfferRevision {\n  id             String     @id @default(uuid()) @db.Char(36)\n  offerId        String     @map(\"offer_id\") @db.Char(36)\n  proposedBy     ProposedBy @map(\"proposed_by\")\n  price          Decimal    @db.Decimal(10, 2)\n  turnaroundDays Int        @map(\"turnaround_days\")\n  note           String?    @db.Text\n  createdAt      DateTime   @default(now()) @map(\"created_at\")\n\n  offer DirectOffer @relation(fields: [offerId], references: [id], onDelete: Cascade)\n\n  @@map(\"offer_revisions\")\n}\n\n// ---------- 2.3 Deal lifecycle ----------\n\nenum DealSource {\n  bid\n  direct_offer\n}\n\n// Mirrors the state machine in §2.4 exactly. Enforce transitions with a single\n// Deal.transition(event) function in the service layer — never write `status = X`\n// from individual route handlers.\nenum DealStatus {\n  negotiating\n  agreement_pending\n  escrow_funded\n  in_production\n  draft_submitted\n  changes_requested\n  approved\n  live\n  completed\n  cancelled\n}\n\nmodel Deal {\n  id          String     @id @default(uuid()) @db.Char(36)\n  clientId    String     @map(\"client_id\") @db.Char(36)\n  creatorId   String     @map(\"creator_id\") @db.Char(36)\n  briefId     String?    @map(\"brief_id\") @db.Char(36)\n  offerId     String?    @map(\"offer_id\") @db.Char(36)\n  source      DealSource\n  agreedPrice Decimal    @map(\"agreed_price\") @db.Decimal(10, 2)\n  status      DealStatus @default(negotiating)\n  createdAt   DateTime   @default(now()) @map(\"created_at\")\n  updatedAt   DateTime   @updatedAt @map(\"updated_at\")\n\n  client       ClientProfile  @relation(fields: [clientId], references: [userId])\n  creator      CreatorProfile @relation(fields: [creatorId], references: [userId])\n  brief        Brief?         @relation(fields: [briefId], references: [id])\n  offer        DirectOffer?   @relation(fields: [offerId], references: [id])\n  agreement    Agreement?\n  drafts       Draft[]\n  escrow       Escrow?\n  reviews      Review[]\n  threads      Thread[]\n  transactions Transaction[]\n\n  @@map(\"deals\")\n}\n\nenum UsageRights {\n  organic\n  paid_ads\n  whitelisting\n}\n\nmodel Agreement {\n  id                 String      @id @default(uuid()) @db.Char(36)\n  dealId             String      @unique @map(\"deal_id\") @db.Char(36)\n  usageRights        UsageRights @map(\"usage_rights\")\n  liveDurationDays   Int         @map(\"live_duration_days\")\n  approvalRequired   Boolean     @map(\"approval_required\")\n  minViews           Int?        @map(\"min_views\")\n  clientConsentedAt  DateTime?   @map(\"client_consented_at\")\n  creatorConsentedAt DateTime?   @map(\"creator_consented_at\")\n\n  deal Deal @relation(fields: [dealId], references: [id], onDelete: Cascade)\n\n  @@map(\"agreements\")\n}\n\nenum DraftStatus {\n  submitted\n  approved\n  changes_requested\n}\n\nmodel Draft {\n  id             String      @id @default(uuid()) @db.Char(36)\n  dealId         String      @map(\"deal_id\") @db.Char(36)\n  fileUrl        String      @map(\"file_url\")\n  note           String?     @db.Text\n  status         DraftStatus @default(submitted)\n  submittedAt    DateTime    @default(now()) @map(\"submitted_at\")\n  reviewedAt     DateTime?   @map(\"reviewed_at\")\n  clientFeedback String?     @map(\"client_feedback\") @db.Text\n\n  deal Deal @relation(fields: [dealId], references: [id], onDelete: Cascade)\n\n  @@map(\"drafts\")\n}\n\nenum EscrowStatus {\n  unfunded\n  held\n  released\n  refunded\n}\n\nmodel Escrow {\n  id               String       @id @default(uuid()) @db.Char(36)\n  dealId           String       @unique @map(\"deal_id\") @db.Char(36)\n  amount           Decimal      @db.Decimal(10, 2)\n  fundedAt         DateTime?    @map(\"funded_at\")\n  liveStartedAt    DateTime?    @map(\"live_started_at\")\n  // Not in §2.3's table — POST /deals/:id/mark-live (§3.8) takes an optional\n  // `live_url` in its body with nowhere documented to persist it.\n  liveUrl          String?      @map(\"live_url\")\n  payoutReleasedAt DateTime?    @map(\"payout_released_at\")\n  status           EscrowStatus @default(unfunded)\n\n  deal Deal @relation(fields: [dealId], references: [id], onDelete: Cascade)\n\n  @@index([status, liveStartedAt])\n  @@map(\"escrows\")\n}\n\n// ---------- 2.6 Payments ----------\n\nmodel PaymentMethod {\n  id            String  @id @default(uuid()) @db.Char(36)\n  clientId      String  @map(\"client_id\") @db.Char(36)\n  providerToken String  @map(\"provider_token\")\n  brand         String\n  last4         String  @db.Char(4)\n  isDefault     Boolean @default(false) @map(\"is_default\")\n\n  client ClientProfile @relation(fields: [clientId], references: [userId])\n\n  @@map(\"payment_methods\")\n}\n\nenum PayoutProvider {\n  stripe_connect\n}\n\nenum PayoutSchedule {\n  weekly\n  biweekly\n}\n\nmodel PayoutMethod {\n  id         String         @id @default(uuid()) @db.Char(36)\n  creatorId  String         @map(\"creator_id\") @db.Char(36)\n  provider   PayoutProvider\n  accountRef String         @map(\"account_ref\")\n  schedule   PayoutSchedule\n\n  creator CreatorProfile @relation(fields: [creatorId], references: [userId])\n\n  @@map(\"payout_methods\")\n}\n\nenum TransactionType {\n  escrow_fund\n  payout\n  refund\n}\n\nenum TransactionStatus {\n  pending\n  succeeded\n  failed\n}\n\nmodel Transaction {\n  id          String            @id @default(uuid()) @db.Char(36)\n  userId      String            @map(\"user_id\") @db.Char(36)\n  dealId      String            @map(\"deal_id\") @db.Char(36)\n  type        TransactionType\n  amount      Decimal           @db.Decimal(10, 2)\n  status      TransactionStatus @default(pending)\n  providerRef String?           @map(\"provider_ref\")\n  createdAt   DateTime          @default(now()) @map(\"created_at\")\n\n  user User @relation(fields: [userId], references: [id])\n  deal Deal @relation(fields: [dealId], references: [id])\n\n  @@index([userId])\n  @@map(\"transactions\")\n}\n\n// ---------- 2.7 Messaging, notifications, reviews ----------\n\n// participant_ids uuid[] (exactly 2) -> explicit A/B FKs, see file header.\nmodel Thread {\n  id             String  @id @default(uuid()) @db.Char(36)\n  participantAId String  @map(\"participant_a_id\") @db.Char(36)\n  participantBId String  @map(\"participant_b_id\") @db.Char(36)\n  dealId         String? @map(\"deal_id\") @db.Char(36)\n  briefId        String? @map(\"brief_id\") @db.Char(36)\n\n  participantA User      @relation(\"ThreadParticipantA\", fields: [participantAId], references: [id])\n  participantB User      @relation(\"ThreadParticipantB\", fields: [participantBId], references: [id])\n  deal         Deal?     @relation(fields: [dealId], references: [id])\n  brief        Brief?    @relation(fields: [briefId], references: [id])\n  messages     Message[]\n\n  @@unique([participantAId, participantBId])\n  @@map(\"threads\")\n}\n\nmodel Message {\n  id            String    @id @default(uuid()) @db.Char(36)\n  threadId      String    @map(\"thread_id\") @db.Char(36)\n  senderId      String    @map(\"sender_id\") @db.Char(36)\n  text          String?   @db.Text\n  attachmentUrl String?   @map(\"attachment_url\")\n  systemEvent   String?   @map(\"system_event\")\n  createdAt     DateTime  @default(now()) @map(\"created_at\")\n  readAt        DateTime? @map(\"read_at\")\n\n  thread Thread @relation(fields: [threadId], references: [id], onDelete: Cascade)\n  sender User   @relation(\"MessageSender\", fields: [senderId], references: [id])\n\n  @@index([threadId, createdAt])\n  @@map(\"messages\")\n}\n\n// type is String, not a native enum — the doc lists it with a trailing \"...\",\n// signaling an open/growing set; keep the known values in a single app-level\n// constant so adding one doesn't require a migration.\nmodel Notification {\n  id        String    @id @default(uuid()) @db.Char(36)\n  userId    String    @map(\"user_id\") @db.Char(36)\n  type      String\n  payload   Json\n  readAt    DateTime? @map(\"read_at\")\n  createdAt DateTime  @default(now()) @map(\"created_at\")\n\n  user User @relation(fields: [userId], references: [id])\n\n  @@index([userId, readAt])\n  @@map(\"notifications\")\n}\n\nmodel Review {\n  id         String   @id @default(uuid()) @db.Char(36)\n  dealId     String   @map(\"deal_id\") @db.Char(36)\n  reviewerId String   @map(\"reviewer_id\") @db.Char(36)\n  revieweeId String   @map(\"reviewee_id\") @db.Char(36)\n  rating     Int\n  tags       Json // string[] against the controlled vocab in §2.5 — extend in app code, not schema\n  comment    String?  @db.Text\n  createdAt  DateTime @default(now()) @map(\"created_at\")\n\n  deal     Deal @relation(fields: [dealId], references: [id])\n  reviewer User @relation(\"ReviewReviewer\", fields: [reviewerId], references: [id])\n  reviewee User @relation(\"ReviewReviewee\", fields: [revieweeId], references: [id])\n\n  @@unique([dealId, reviewerId])\n  @@map(\"reviews\")\n}\n\n// Not in §2's table, but required by §3.11's `POST /push-tokens {platform, token}`.\nmodel PushToken {\n  id        String   @id @default(uuid()) @db.Char(36)\n  userId    String   @map(\"user_id\") @db.Char(36)\n  platform  String\n  token     String   @db.Text\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  user User @relation(fields: [userId], references: [id])\n\n  @@unique([userId, token(length: 255)])\n  @@map(\"push_tokens\")\n}\n",
  "inlineSchemaHash": "10bd51d6fc6978dc6bf51fab141fedfffa1ba8ce44e2afdb267e65906356ddcb",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passwordHash\",\"dbName\":\"password_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oauthProviders\",\"dbName\":\"oauth_providers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activeRole\",\"dbName\":\"active_role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hasClientProfile\",\"dbName\":\"has_client_profile\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hasCreatorProfile\",\"dbName\":\"has_creator_profile\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notificationPrefs\",\"dbName\":\"notification_prefs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"clientProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClientProfile\",\"relationName\":\"ClientProfileToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"CreatorProfileToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentMessages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Message\",\"relationName\":\"MessageSender\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Notification\",\"relationName\":\"NotificationToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewsWritten\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Review\",\"relationName\":\"ReviewReviewer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewsReceived\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Review\",\"relationName\":\"ReviewReviewee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"relationName\":\"TransactionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"threadsAsA\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Thread\",\"relationName\":\"ThreadParticipantA\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"threadsAsB\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Thread\",\"relationName\":\"ThreadParticipantB\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pushTokens\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PushToken\",\"relationName\":\"PushTokenToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ClientProfile\":{\"dbName\":\"client_profiles\",\"fields\":[{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"companyName\",\"dbName\":\"company_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarUrl\",\"dbName\":\"avatar_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ClientProfileToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"briefs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brief\",\"relationName\":\"BriefToClientProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"directOffers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DirectOffer\",\"relationName\":\"ClientProfileToDirectOffer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"ClientProfileToDeal\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentMethods\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"relationName\":\"ClientProfileToPaymentMethod\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CreatorProfile\":{\"dbName\":\"creator_profiles\",\"fields\":[{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"niches\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startingRate\",\"dbName\":\"starting_rate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"typicalTurnaroundDays\",\"dbName\":\"typical_turnaround_days\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarUrl\",\"dbName\":\"avatar_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avgRating\",\"dbName\":\"avg_rating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewCount\",\"dbName\":\"review_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CreatorProfileToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"socialAccounts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SocialAccount\",\"relationName\":\"CreatorProfileToSocialAccount\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"portfolioItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PortfolioItem\",\"relationName\":\"CreatorProfileToPortfolioItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bids\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bid\",\"relationName\":\"BidToCreatorProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"directOffers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DirectOffer\",\"relationName\":\"CreatorProfileToDirectOffer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"CreatorProfileToDeal\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payoutMethods\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PayoutMethod\",\"relationName\":\"CreatorProfileToPayoutMethod\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SocialAccount\":{\"dbName\":\"social_accounts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorId\",\"dbName\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"platform\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SocialPlatform\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"handle\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"followerCount\",\"dbName\":\"follower_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"engagementRate\",\"dbName\":\"engagement_rate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oauthTokenRef\",\"dbName\":\"oauth_token_ref\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastSyncedAt\",\"dbName\":\"last_synced_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"CreatorProfileToSocialAccount\",\"relationFromFields\":[\"creatorId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"creatorId\",\"platform\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"creatorId\",\"platform\"]}],\"isGenerated\":false},\"PortfolioItem\":{\"dbName\":\"portfolio_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorId\",\"dbName\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mediaUrl\",\"dbName\":\"media_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sortOrder\",\"dbName\":\"sort_order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"CreatorProfileToPortfolioItem\",\"relationFromFields\":[\"creatorId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Brief\":{\"dbName\":\"briefs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"dbName\":\"client_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"format\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BriefFormat\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"niche\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetMin\",\"dbName\":\"budget_min\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetMax\",\"dbName\":\"budget_max\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BriefStatus\",\"default\":\"open\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClientProfile\",\"relationName\":\"BriefToClientProfile\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceImages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReferenceImage\",\"relationName\":\"BriefToReferenceImage\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bids\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bid\",\"relationName\":\"BidToBrief\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"directOffers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DirectOffer\",\"relationName\":\"BriefToDirectOffer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"BriefToDeal\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"threads\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Thread\",\"relationName\":\"BriefToThread\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ReferenceImage\":{\"dbName\":\"reference_images\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"briefId\",\"dbName\":\"brief_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"imageUrl\",\"dbName\":\"image_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brief\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brief\",\"relationName\":\"BriefToReferenceImage\",\"relationFromFields\":[\"briefId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Bid\":{\"dbName\":\"bids\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"briefId\",\"dbName\":\"brief_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorId\",\"dbName\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryDays\",\"dbName\":\"delivery_days\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BidStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brief\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brief\",\"relationName\":\"BidToBrief\",\"relationFromFields\":[\"briefId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"BidToCreatorProfile\",\"relationFromFields\":[\"creatorId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"briefId\",\"creatorId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"briefId\",\"creatorId\"]}],\"isGenerated\":false},\"DirectOffer\":{\"dbName\":\"direct_offers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"dbName\":\"client_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorId\",\"dbName\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"briefId\",\"dbName\":\"brief_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"format\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BriefFormat\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"turnaroundDays\",\"dbName\":\"turnaround_days\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OfferStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClientProfile\",\"relationName\":\"ClientProfileToDirectOffer\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"CreatorProfileToDirectOffer\",\"relationFromFields\":[\"creatorId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brief\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brief\",\"relationName\":\"BriefToDirectOffer\",\"relationFromFields\":[\"briefId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revisions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OfferRevision\",\"relationName\":\"DirectOfferToOfferRevision\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"DealToDirectOffer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"OfferRevision\":{\"dbName\":\"offer_revisions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"offerId\",\"dbName\":\"offer_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proposedBy\",\"dbName\":\"proposed_by\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProposedBy\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"turnaroundDays\",\"dbName\":\"turnaround_days\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"offer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DirectOffer\",\"relationName\":\"DirectOfferToOfferRevision\",\"relationFromFields\":[\"offerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Deal\":{\"dbName\":\"deals\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"dbName\":\"client_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorId\",\"dbName\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"briefId\",\"dbName\":\"brief_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"offerId\",\"dbName\":\"offer_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"source\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DealSource\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agreedPrice\",\"dbName\":\"agreed_price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DealStatus\",\"default\":\"negotiating\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClientProfile\",\"relationName\":\"ClientProfileToDeal\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"CreatorProfileToDeal\",\"relationFromFields\":[\"creatorId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brief\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brief\",\"relationName\":\"BriefToDeal\",\"relationFromFields\":[\"briefId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"offer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DirectOffer\",\"relationName\":\"DealToDirectOffer\",\"relationFromFields\":[\"offerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agreement\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Agreement\",\"relationName\":\"AgreementToDeal\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"drafts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Draft\",\"relationName\":\"DealToDraft\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"escrow\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Escrow\",\"relationName\":\"DealToEscrow\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviews\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Review\",\"relationName\":\"DealToReview\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"threads\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Thread\",\"relationName\":\"DealToThread\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"relationName\":\"DealToTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Agreement\":{\"dbName\":\"agreements\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dealId\",\"dbName\":\"deal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usageRights\",\"dbName\":\"usage_rights\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UsageRights\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"liveDurationDays\",\"dbName\":\"live_duration_days\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvalRequired\",\"dbName\":\"approval_required\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minViews\",\"dbName\":\"min_views\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientConsentedAt\",\"dbName\":\"client_consented_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorConsentedAt\",\"dbName\":\"creator_consented_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"AgreementToDeal\",\"relationFromFields\":[\"dealId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Draft\":{\"dbName\":\"drafts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dealId\",\"dbName\":\"deal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileUrl\",\"dbName\":\"file_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DraftStatus\",\"default\":\"submitted\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submittedAt\",\"dbName\":\"submitted_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewedAt\",\"dbName\":\"reviewed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientFeedback\",\"dbName\":\"client_feedback\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"DealToDraft\",\"relationFromFields\":[\"dealId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Escrow\":{\"dbName\":\"escrows\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dealId\",\"dbName\":\"deal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fundedAt\",\"dbName\":\"funded_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"liveStartedAt\",\"dbName\":\"live_started_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"liveUrl\",\"dbName\":\"live_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payoutReleasedAt\",\"dbName\":\"payout_released_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EscrowStatus\",\"default\":\"unfunded\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"DealToEscrow\",\"relationFromFields\":[\"dealId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PaymentMethod\":{\"dbName\":\"payment_methods\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"dbName\":\"client_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerToken\",\"dbName\":\"provider_token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brand\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"last4\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isDefault\",\"dbName\":\"is_default\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClientProfile\",\"relationName\":\"ClientProfileToPaymentMethod\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PayoutMethod\":{\"dbName\":\"payout_methods\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creatorId\",\"dbName\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PayoutProvider\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accountRef\",\"dbName\":\"account_ref\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"schedule\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PayoutSchedule\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreatorProfile\",\"relationName\":\"CreatorProfileToPayoutMethod\",\"relationFromFields\":[\"creatorId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Transaction\":{\"dbName\":\"transactions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dealId\",\"dbName\":\"deal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TransactionStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerRef\",\"dbName\":\"provider_ref\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TransactionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"DealToTransaction\",\"relationFromFields\":[\"dealId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Thread\":{\"dbName\":\"threads\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"participantAId\",\"dbName\":\"participant_a_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"participantBId\",\"dbName\":\"participant_b_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dealId\",\"dbName\":\"deal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"briefId\",\"dbName\":\"brief_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"participantA\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ThreadParticipantA\",\"relationFromFields\":[\"participantAId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"participantB\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ThreadParticipantB\",\"relationFromFields\":[\"participantBId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"DealToThread\",\"relationFromFields\":[\"dealId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brief\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brief\",\"relationName\":\"BriefToThread\",\"relationFromFields\":[\"briefId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"messages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Message\",\"relationName\":\"MessageToThread\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"participantAId\",\"participantBId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"participantAId\",\"participantBId\"]}],\"isGenerated\":false},\"Message\":{\"dbName\":\"messages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"threadId\",\"dbName\":\"thread_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderId\",\"dbName\":\"sender_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attachmentUrl\",\"dbName\":\"attachment_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"systemEvent\",\"dbName\":\"system_event\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readAt\",\"dbName\":\"read_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thread\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Thread\",\"relationName\":\"MessageToThread\",\"relationFromFields\":[\"threadId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"MessageSender\",\"relationFromFields\":[\"senderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Notification\":{\"dbName\":\"notifications\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readAt\",\"dbName\":\"read_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"NotificationToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Review\":{\"dbName\":\"reviews\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dealId\",\"dbName\":\"deal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewerId\",\"dbName\":\"reviewer_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revieweeId\",\"dbName\":\"reviewee_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"comment\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deal\",\"relationName\":\"DealToReview\",\"relationFromFields\":[\"dealId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ReviewReviewer\",\"relationFromFields\":[\"reviewerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ReviewReviewee\",\"relationFromFields\":[\"revieweeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"dealId\",\"reviewerId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"dealId\",\"reviewerId\"]}],\"isGenerated\":false},\"PushToken\":{\"dbName\":\"push_tokens\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"platform\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"PushTokenToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"userId\",\"token\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"token\"]}],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"client\",\"dbName\":null},{\"name\":\"creator\",\"dbName\":null}],\"dbName\":null},\"SocialPlatform\":{\"values\":[{\"name\":\"instagram\",\"dbName\":null},{\"name\":\"tiktok\",\"dbName\":null},{\"name\":\"youtube\",\"dbName\":null},{\"name\":\"facebook\",\"dbName\":null}],\"dbName\":null},\"BriefFormat\":{\"values\":[{\"name\":\"reel\",\"dbName\":null},{\"name\":\"ugc\",\"dbName\":null},{\"name\":\"youtube\",\"dbName\":null},{\"name\":\"tiktok\",\"dbName\":null},{\"name\":\"photo\",\"dbName\":null}],\"dbName\":null},\"BriefStatus\":{\"values\":[{\"name\":\"open\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"BidStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"accepted\",\"dbName\":null},{\"name\":\"declined\",\"dbName\":null}],\"dbName\":null},\"OfferStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"countered\",\"dbName\":null},{\"name\":\"accepted\",\"dbName\":null},{\"name\":\"declined\",\"dbName\":null}],\"dbName\":null},\"ProposedBy\":{\"values\":[{\"name\":\"client\",\"dbName\":null},{\"name\":\"creator\",\"dbName\":null}],\"dbName\":null},\"DealSource\":{\"values\":[{\"name\":\"bid\",\"dbName\":null},{\"name\":\"direct_offer\",\"dbName\":null}],\"dbName\":null},\"DealStatus\":{\"values\":[{\"name\":\"negotiating\",\"dbName\":null},{\"name\":\"agreement_pending\",\"dbName\":null},{\"name\":\"escrow_funded\",\"dbName\":null},{\"name\":\"in_production\",\"dbName\":null},{\"name\":\"draft_submitted\",\"dbName\":null},{\"name\":\"changes_requested\",\"dbName\":null},{\"name\":\"approved\",\"dbName\":null},{\"name\":\"live\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"UsageRights\":{\"values\":[{\"name\":\"organic\",\"dbName\":null},{\"name\":\"paid_ads\",\"dbName\":null},{\"name\":\"whitelisting\",\"dbName\":null}],\"dbName\":null},\"DraftStatus\":{\"values\":[{\"name\":\"submitted\",\"dbName\":null},{\"name\":\"approved\",\"dbName\":null},{\"name\":\"changes_requested\",\"dbName\":null}],\"dbName\":null},\"EscrowStatus\":{\"values\":[{\"name\":\"unfunded\",\"dbName\":null},{\"name\":\"held\",\"dbName\":null},{\"name\":\"released\",\"dbName\":null},{\"name\":\"refunded\",\"dbName\":null}],\"dbName\":null},\"PayoutProvider\":{\"values\":[{\"name\":\"stripe_connect\",\"dbName\":null}],\"dbName\":null},\"PayoutSchedule\":{\"values\":[{\"name\":\"weekly\",\"dbName\":null},{\"name\":\"biweekly\",\"dbName\":null}],\"dbName\":null},\"TransactionType\":{\"values\":[{\"name\":\"escrow_fund\",\"dbName\":null},{\"name\":\"payout\",\"dbName\":null},{\"name\":\"refund\",\"dbName\":null}],\"dbName\":null},\"TransactionStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"succeeded\",\"dbName\":null},{\"name\":\"failed\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

