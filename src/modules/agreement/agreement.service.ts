import type { UsageRights } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { transitionDeal } from "../deals/deal.state";
import { assertParticipant } from "../deals/deals.service";

export interface SetAgreementInput {
  usageRights: UsageRights;
  liveDurationDays: number;
  approvalRequired: boolean;
  minViews?: number;
}

// §4 rule 1: consent is a hard gate. Setting terms only ever moves the deal
// negotiating -> agreement_pending; escrow_funded still requires
// creator_consented_at, enforced again in the fund endpoint (§3.8).
export async function setAgreement(dealId: string, clientId: string, input: SetAgreementInput) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.clientId !== clientId) throw new ApiError(403, "Not your deal");

  return prisma.$transaction(async (tx) => {
    const agreement = await tx.agreement.create({
      data: {
        dealId,
        usageRights: input.usageRights,
        liveDurationDays: input.liveDurationDays,
        approvalRequired: input.approvalRequired,
        minViews: input.minViews,
        clientConsentedAt: new Date(),
      },
    });

    await transitionDeal(tx, dealId, "SET_AGREEMENT");

    return agreement;
  });
}

export async function getAgreement(dealId: string, userId: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);

  const agreement = await prisma.agreement.findUnique({ where: { dealId } });
  if (!agreement) throw new ApiError(404, "No agreement set on this deal yet");
  return agreement;
}

// This is the literal enforcement point for screen 15's checkbox — `consented`
// must be exactly `true`, and terms must already exist, or this rejects with 400
// (not 403/409) per §3.7's own wording.
export async function giveConsent(dealId: string, creatorId: string, consented: unknown) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.creatorId !== creatorId) throw new ApiError(403, "Not your deal");

  if (consented !== true) {
    throw new ApiError(400, "consented must be true");
  }

  const agreement = await prisma.agreement.findUnique({ where: { dealId } });
  if (!agreement || agreement.clientConsentedAt === null) {
    throw new ApiError(400, "Client has not set terms yet");
  }

  return prisma.agreement.update({
    where: { dealId },
    data: { creatorConsentedAt: new Date() },
  });
}
