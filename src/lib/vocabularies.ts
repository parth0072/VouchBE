// Controlled vocabularies from Backend Requirements.md §2.5 that the doc marks
// "extend as needed" — kept as plain lists (not DB enums) so a new value is a
// code change here, not a migration. See the Json-vs-enum note in schema.prisma.

export const NICHES = ["beauty", "fitness", "product", "travel", "food", "tech"] as const;
export type Niche = (typeof NICHES)[number];

export const REVIEW_TAGS = ["great_communication", "on_time", "high_quality"] as const;
export type ReviewTag = (typeof REVIEW_TAGS)[number];

// Notification.type is a plain string column (see schema.prisma), not a native
// enum, because §2.7 documents it with a trailing "..." — this is the known set
// today; add to it here as new event types get wired up, no migration needed.
export const NOTIFICATION_TYPES = [
  "bid_received",
  "offer_countered",
  "escrow_funded",
  "draft_submitted",
  "draft_approved",
  "changes_requested",
  "review_received",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
