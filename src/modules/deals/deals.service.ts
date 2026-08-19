import { db } from "../../db";
import { ApiError } from "../../lib/apiError";
import { transitionDeal } from "./deal.state";

export function assertParticipant(deal: { clientId: string; creatorId: string }, userId: string) {
  if (deal.clientId !== userId && deal.creatorId !== userId) {
    throw new ApiError(403, "Not a participant on this deal");
  }
}

// MySQL has no relation-loading like Prisma's `include` — agreement/escrow are
// fetched as separate batched queries (WHERE dealId IN (...ids), not one query
// per deal) and merged in application code.
async function attachRelations<T extends { id: string }>(deals: T[]) {
  if (deals.length === 0) return [];
  const ids = deals.map((d) => d.id);
  const [agreements, escrows] = await Promise.all([
    db.selectFrom("agreements").selectAll().where("dealId", "in", ids).execute(),
    db.selectFrom("escrows").selectAll().where("dealId", "in", ids).execute(),
  ]);
  const agreementByDeal = new Map(agreements.map((a) => [a.dealId, a]));
  const escrowByDeal = new Map(escrows.map((e) => [e.dealId, e]));
  return deals.map((deal) => ({
    ...deal,
    agreement: agreementByDeal.get(deal.id) ?? null,
    escrow: escrowByDeal.get(deal.id) ?? null,
  }));
}

export async function getDealForParticipant(dealId: string, userId: string) {
  const deal = await db.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);
  const [withRelations] = await attachRelations([deal]);
  return withRelations;
}

export async function listMyDeals(userId: string) {
  const deals = await db
    .selectFrom("deals")
    .selectAll()
    .where((eb) => eb.or([eb("clientId", "=", userId), eb("creatorId", "=", userId)]))
    .orderBy("updatedAt", "desc")
    .execute();
  return attachRelations(deals);
}

// Not in §3 of the doc — added to close a gap: the §2.4 state machine defines
// `cancellable_states: negotiating, agreement_pending -> cancelled` but no
// endpoint anywhere triggers it.
export async function cancelDeal(dealId: string, userId: string) {
  const deal = await db.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);

  return db.transaction().execute((trx) => transitionDeal(trx, dealId, "CANCEL"));
}
