import type { BriefFormat } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { getOrCreateThread } from "../messaging/threads.service";
import { createNotification } from "../notifications/notifications.service";

export interface CreateOfferInput {
  creatorId: string;
  briefId?: string;
  price: number;
  format: BriefFormat;
  turnaroundDays: number;
  message?: string;
}

export async function createOffer(clientId: string, input: CreateOfferInput) {
  const creator = await prisma.creatorProfile.findUnique({ where: { userId: input.creatorId } });
  if (!creator) throw new ApiError(404, "Creator not found");

  if (input.briefId) {
    const brief = await prisma.brief.findUnique({ where: { id: input.briefId } });
    if (!brief) throw new ApiError(404, "Brief not found");
    if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");
  }

  await getOrCreateThread(clientId, input.creatorId, { briefId: input.briefId });

  return prisma.directOffer.create({
    data: {
      clientId,
      creatorId: input.creatorId,
      briefId: input.briefId,
      price: input.price,
      format: input.format,
      turnaroundDays: input.turnaroundDays,
      message: input.message,
    },
  });
}

export async function listMyOffers(userId: string) {
  return prisma.directOffer.findMany({
    where: { OR: [{ clientId: userId }, { creatorId: userId }] },
    orderBy: { createdAt: "desc" },
  });
}

function assertParticipant(offer: { clientId: string; creatorId: string }, userId: string) {
  if (offer.clientId !== userId && offer.creatorId !== userId) {
    throw new ApiError(403, "Not a participant on this offer");
  }
}

export async function getOfferById(offerId: string, userId: string) {
  const offer = await prisma.directOffer.findUnique({
    where: { id: offerId },
    include: { revisions: { orderBy: { createdAt: "asc" } } },
  });
  if (!offer) throw new ApiError(404, "Offer not found");
  assertParticipant(offer, userId);
  return offer;
}

async function getActiveOfferForParticipant(offerId: string, userId: string) {
  const offer = await prisma.directOffer.findUnique({ where: { id: offerId } });
  if (!offer) throw new ApiError(404, "Offer not found");
  assertParticipant(offer, userId);
  if (offer.status === "accepted" || offer.status === "declined") {
    throw new ApiError(409, `Offer is already ${offer.status}`);
  }
  return offer;
}

export interface CounterOfferInput {
  price: number;
  turnaroundDays: number;
  note?: string;
}

export async function counterOffer(offerId: string, userId: string, input: CounterOfferInput) {
  const offer = await getActiveOfferForParticipant(offerId, userId);
  const proposedBy = offer.clientId === userId ? "client" : "creator";
  const recipientId = proposedBy === "client" ? offer.creatorId : offer.clientId;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.offerRevision.create({
      data: {
        offerId,
        proposedBy,
        price: input.price,
        turnaroundDays: input.turnaroundDays,
        note: input.note,
      },
    });

    return tx.directOffer.update({
      where: { id: offerId },
      data: {
        price: input.price,
        turnaroundDays: input.turnaroundDays,
        status: "countered",
      },
    });
  });

  await createNotification(recipientId, "offer_countered", {
    offer_id: offerId,
    price: input.price,
  });

  return updated;
}

export async function acceptOffer(offerId: string, userId: string) {
  const offer = await getActiveOfferForParticipant(offerId, userId);

  const deal = await prisma.$transaction(async (tx) => {
    await tx.directOffer.update({ where: { id: offerId }, data: { status: "accepted" } });

    return tx.deal.create({
      data: {
        clientId: offer.clientId,
        creatorId: offer.creatorId,
        briefId: offer.briefId,
        offerId: offer.id,
        source: "direct_offer",
        agreedPrice: offer.price,
      },
    });
  });

  // Thread already exists from createOffer() — this just attaches the new
  // deal id. Outside the transaction above: getOrCreateThread runs on its own
  // connection, and leaving a thread's dealId unset if this fails is a cosmetic
  // gap, not a correctness one — the Deal record is already safely committed.
  await getOrCreateThread(offer.clientId, offer.creatorId, { dealId: deal.id });

  return deal;
}

export async function declineOffer(offerId: string, userId: string) {
  await getActiveOfferForParticipant(offerId, userId);
  return prisma.directOffer.update({ where: { id: offerId }, data: { status: "declined" } });
}
