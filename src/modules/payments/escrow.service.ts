import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { getStripe } from "../../lib/stripe";
import { transitionDeal } from "../deals/deal.state";
import { createNotification } from "../notifications/notifications.service";

// §4 rule 1, enforced a second time here per the doc's explicit instruction:
// "the deal cannot reach escrow_funded without creator_consented_at set —
// enforce this in POST /deals/:id/fund too, not just at the consent endpoint."
export async function fundEscrow(dealId: string, clientId: string, paymentMethodId: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, include: { agreement: true } });
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.clientId !== clientId) throw new ApiError(403, "Not your deal");
  if (!deal.agreement?.creatorConsentedAt) {
    throw new ApiError(400, "Creator has not consented to the agreement yet");
  }

  const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
  if (!paymentMethod || paymentMethod.clientId !== clientId) {
    throw new ApiError(404, "Payment method not found");
  }

  // Real charge happens before any DB write — never mark a deal funded for a
  // payment that didn't actually go through.
  const stripe = getStripe();
  const amountCents = Math.round(Number(deal.agreedPrice) * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    payment_method: paymentMethod.providerToken,
    capture_method: "manual", // §5: manual-capture PaymentIntents for escrow
    confirm: true,
    off_session: true,
  });

  const escrow = await prisma.$transaction(async (tx) => {
    const escrow = await tx.escrow.upsert({
      where: { dealId },
      create: { dealId, amount: deal.agreedPrice, fundedAt: new Date(), status: "held" },
      update: { amount: deal.agreedPrice, fundedAt: new Date(), status: "held" },
    });

    await transitionDeal(tx, dealId, "FUND_ESCROW");
    await transitionDeal(tx, dealId, "START_PRODUCTION");

    await tx.transaction.create({
      data: {
        userId: clientId,
        dealId,
        type: "escrow_fund",
        amount: deal.agreedPrice,
        status: "succeeded",
        providerRef: paymentIntent.id,
      },
    });

    return escrow;
  });

  await createNotification(deal.creatorId, "escrow_funded", {
    deal_id: dealId,
    amount: deal.agreedPrice.toString(),
  });

  return escrow;
}

export async function markLive(dealId: string, creatorId: string, liveUrl?: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.creatorId !== creatorId) throw new ApiError(403, "Not your deal");

  return prisma.$transaction(async (tx) => {
    await transitionDeal(tx, dealId, "MARK_LIVE");

    return tx.escrow.update({
      where: { dealId },
      data: { liveStartedAt: new Date(), liveUrl },
    });
  });
}

export interface ReleaseDuePayoutsSummary {
  released: string[]; // dealIds
  failed: { dealId: string; reason: string }[];
}

// Scheduled job target, not user-facing — see routes for the shared-secret gate.
// Finds Escrow rows where live_started_at + Agreement.live_duration_days <= now()
// and status=held. The "due" condition mixes two tables with a per-row variable
// (live_duration_days), which isn't expressible as a single Prisma `where`, so
// candidates are fetched by the static half (status=held, liveStartedAt set) and
// the date math is applied in application code.
export async function releaseDuePayouts(): Promise<ReleaseDuePayoutsSummary> {
  const candidates = await prisma.escrow.findMany({
    where: { status: "held", liveStartedAt: { not: null } },
    include: { deal: { include: { agreement: true } } },
  });

  const now = Date.now();
  const due = candidates.filter((escrow) => {
    const liveDurationDays = escrow.deal.agreement?.liveDurationDays;
    if (!liveDurationDays || !escrow.liveStartedAt) return false;
    const dueAt = escrow.liveStartedAt.getTime() + liveDurationDays * 24 * 60 * 60 * 1000;
    return dueAt <= now;
  });

  const summary: ReleaseDuePayoutsSummary = { released: [], failed: [] };

  for (const escrow of due) {
    try {
      await releaseOne(escrow.dealId, escrow.deal.creatorId, escrow.amount.toNumber());
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
  const payoutMethod = await prisma.payoutMethod.findFirst({ where: { creatorId } });
  if (!payoutMethod) {
    throw new ApiError(422, `Creator ${creatorId} has no payout method on file`);
  }

  const stripe = getStripe();
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    destination: payoutMethod.accountRef,
  });

  await prisma.$transaction(async (tx) => {
    await tx.escrow.update({
      where: { dealId },
      data: { payoutReleasedAt: new Date(), status: "released" },
    });

    await transitionDeal(tx, dealId, "RELEASE_PAYOUT");

    await tx.transaction.create({
      data: {
        userId: creatorId,
        dealId,
        type: "payout",
        amount,
        status: "succeeded",
        providerRef: transfer.id,
      },
    });
  });
}
