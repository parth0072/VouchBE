
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('@prisma/client/runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
