import type { Transaction } from "kysely";
import type { Database, DealStatus } from "../../db/types";
import { ApiError } from "../../lib/apiError";

// Single authoritative place for Deal.status writes — see the DealStatus type
// comment in db/types.ts. Every other module imports transitionDeal() instead
// of writing `status: X` directly in an update.

export type DealEvent =
  | "SET_AGREEMENT"
  | "FUND_ESCROW"
  | "START_PRODUCTION"
  | "SUBMIT_DRAFT"
  | "REQUEST_CHANGES"
  | "APPROVE_DRAFT"
  | "MARK_LIVE"
  | "RELEASE_PAYOUT"
  | "CANCEL";

const TRANSITIONS: Record<DealEvent, { from: DealStatus[]; to: DealStatus }> = {
  SET_AGREEMENT: { from: ["negotiating"], to: "agreement_pending" },
  FUND_ESCROW: { from: ["agreement_pending"], to: "escrow_funded" },
  // §2.4's diagram draws escrow_funded -> in_production as a single unlabeled
  // arrow — no endpoint in §3 fires it separately. POST /deals/:id/fund calls
  // FUND_ESCROW then START_PRODUCTION back to back in the same transaction, so
  // both documented states are real without either needing its own trigger.
  START_PRODUCTION: { from: ["escrow_funded"], to: "in_production" },
  SUBMIT_DRAFT: { from: ["in_production", "changes_requested"], to: "draft_submitted" },
  REQUEST_CHANGES: { from: ["draft_submitted"], to: "changes_requested" },
  APPROVE_DRAFT: { from: ["draft_submitted"], to: "approved" },
  MARK_LIVE: { from: ["approved"], to: "live" },
  RELEASE_PAYOUT: { from: ["live"], to: "completed" },
  CANCEL: { from: ["negotiating", "agreement_pending"], to: "cancelled" },
};

// MySQL has no RETURNING clause, so an update is a write followed by a read —
// unlike Prisma, which made that look like one call.
export async function transitionDeal(trx: Transaction<Database>, dealId: string, event: DealEvent) {
  const deal = await trx.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirstOrThrow();
  const rule = TRANSITIONS[event];

  if (!rule.from.includes(deal.status)) {
    throw new ApiError(409, `Cannot apply ${event} to a deal in status "${deal.status}"`);
  }

  await trx.updateTable("deals").set({ status: rule.to, updatedAt: new Date() }).where("id", "=", dealId).execute();

  return trx.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirstOrThrow();
}
