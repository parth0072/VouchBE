import type { Deal } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { transitionDeal } from "./deal.state";

export function assertParticipant(deal: Pick<Deal, "clientId" | "creatorId">, userId: string) {
  if (deal.clientId !== userId && deal.creatorId !== userId) {
    throw new ApiError(403, "Not a participant on this deal");
  }
}

const dealInclude = { agreement: true, escrow: true } as const;

export async function getDealForParticipant(dealId: string, userId: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, include: dealInclude });
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);
  return deal;
}

export async function listMyDeals(userId: string) {
  return prisma.deal.findMany({
    where: { OR: [{ clientId: userId }, { creatorId: userId }] },
    include: dealInclude,
    orderBy: { updatedAt: "desc" },
  });
}

// Not in §3 of the doc — added to close a gap: the §2.4 state machine defines
// `cancellable_states: negotiating, agreement_pending -> cancelled` but no
// endpoint anywhere triggers it.
export async function cancelDeal(dealId: string, userId: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);

  return prisma.$transaction((tx) => transitionDeal(tx, dealId, "CANCEL"));
}
