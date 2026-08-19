import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { getStripe } from "../../lib/stripe";
import { transitionDeal } from "../deals/deal.state";
import { createNotification } from "../notifications/notifications.service";

// §4 rule 1, enforced a second time here per the doc's explicit instruction:
// "the deal cannot reach escrow_funded without creator_consented_at set —
// enforce this in POST /deals/:id/fund too, not just at the consent endpoint."
export async function fundEscrow(dealId: string, clientId: string, paymentMethodId: string) {
  const deal = await db.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.clientId !== clientId) throw new ApiError(403, "Not your deal");

  const agreement = await db.selectFrom("agreements").select("creatorConsentedAt").where("dealId", "=", dealId).executeTakeFirst();
  if (!agreement?.creatorConsentedAt) {
    throw new ApiError(400, "Creator has not consented to the agreement yet");
  }

  const paymentMethod = await db.selectFrom("paymentMethods").selectAll().where("id", "=", paymentMethodId).executeTakeFirst();
  if (!paymentMethod || paymentMethod.clientId !== clientId) {
    throw new ApiError(404, "Payment method not found");
  }

  // Real charge happens before any DB write — never mark a deal funded for a
  // payment that didn't actually go through.
  const stripe = getStripe();
  const agreedPrice = Number(deal.agreedPrice);
  const amountCents = Math.round(agreedPrice * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    payment_method: paymentMethod.providerToken,
    capture_method: "manual", // §5: manual-capture PaymentIntents for escrow
    confirm: true,
    off_session: true,
  });

  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("escrows")
      .values({ id: newId(), dealId, amount: agreedPrice, fundedAt: new Date(), status: "held" })
      .onDuplicateKeyUpdate({ amount: agreedPrice, fundedAt: new Date(), status: "held" })
      .execute();

    await transitionDeal(trx, dealId, "FUND_ESCROW");
    await transitionDeal(trx, dealId, "START_PRODUCTION");

    await trx
      .insertInto("transactions")
      .values({
        id: newId(),
        userId: clientId,
        dealId,
        type: "escrow_fund",
        amount: agreedPrice,
        status: "succeeded",
        providerRef: paymentIntent.id,
      })
      .execute();
  });
  const escrow = await db.selectFrom("escrows").selectAll().where("dealId", "=", dealId).executeTakeFirstOrThrow();

  await createNotification(deal.creatorId, "escrow_funded", {
    deal_id: dealId,
    amount: deal.agreedPrice,
  });

  return escrow;
}

export async function markLive(dealId: string, creatorId: string, liveUrl?: string) {
  const deal = await db.selectFrom("deals").select(["creatorId"]).where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.creatorId !== creatorId) throw new ApiError(403, "Not your deal");

  await db.transaction().execute(async (trx) => {
    await transitionDeal(trx, dealId, "MARK_LIVE");
    await trx.updateTable("escrows").set({ liveStartedAt: new Date(), liveUrl }).where("dealId", "=", dealId).execute();
  });

  return db.selectFrom("escrows").selectAll().where("dealId", "=", dealId).executeTakeFirstOrThrow();
}

export interface ReleaseDuePayoutsSummary {
  released: string[]; // dealIds
  failed: { dealId: string; reason: string }[];
}

// Scheduled job target, not user-facing — see routes for the shared-secret gate.
// Finds Escrow rows where live_started_at + Agreement.live_duration_days <= now()
// and status=held. The "due" condition mixes two tables with a per-row variable
// (live_duration_days), which isn't expressible as a single static WHERE, so
// candidates are fetched by the static half (status=held, liveStartedAt set) and
// the date math is applied in application code.
export async function releaseDuePayouts(): Promise<ReleaseDuePayoutsSummary> {
  const candidates = await db
    .selectFrom("escrows")
    .innerJoin("deals", "deals.id", "escrows.dealId")
    .leftJoin("agreements", "agreements.dealId", "deals.id")
    .select([
      "escrows.dealId as dealId",
      "escrows.liveStartedAt as liveStartedAt",
      "escrows.amount as amount",
      "deals.creatorId as creatorId",
      "agreements.liveDurationDays as liveDurationDays",
    ])
    .where("escrows.status", "=", "held")
    .where("escrows.liveStartedAt", "is not", null)
    .execute();

  const now = Date.now();
  const due = candidates.filter((escrow) => {
    if (!escrow.liveDurationDays || !escrow.liveStartedAt) return false;
    const dueAt = escrow.liveStartedAt.getTime() + escrow.liveDurationDays * 24 * 60 * 60 * 1000;
    return dueAt <= now;
  });

  const summary: ReleaseDuePayoutsSummary = { released: [], failed: [] };

  for (const escrow of due) {
    try {
      await releaseOne(escrow.dealId, escrow.creatorId, Number(escrow.amount));
      summary.released.push(escrow.dealId);
    } catch (err) {
      summary.failed.push({
        dealId: escrow.dealId,
        reason: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return summary;
}

async function releaseOne(dealId: string, creatorId: string, amount: number) {
  const payoutMethod = await db.selectFrom("payoutMethods").selectAll().where("creatorId", "=", creatorId).executeTakeFirst();
  if (!payoutMethod) {
    throw new ApiError(422, `Creator ${creatorId} has no payout method on file`);
  }

  const stripe = getStripe();
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    destination: payoutMethod.accountRef,
  });

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable("escrows")
      .set({ payoutReleasedAt: new Date(), status: "released" })
      .where("dealId", "=", dealId)
      .execute();

    await transitionDeal(trx, dealId, "RELEASE_PAYOUT");

    await trx
      .insertInto("transactions")
      .values({
        id: newId(),
        userId: creatorId,
        dealId,
        type: "payout",
        amount,
        status: "succeeded",
        providerRef: transfer.id,
      })
      .execute();
  });
}
