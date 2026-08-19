import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { getOrCreateThread } from "../messaging/threads.service";
import { createNotification } from "../notifications/notifications.service";

export interface CreateBidInput {
  price: number;
  deliveryDays: number;
  note?: string;
}

export async function createBid(briefId: string, creatorId: string, input: CreateBidInput) {
  const brief = await prisma.brief.findUnique({ where: { id: briefId } });
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.status !== "open") throw new ApiError(409, "This brief is no longer open for bids");

  const existing = await prisma.bid.findUnique({
    where: { briefId_creatorId: { briefId, creatorId } },
  });
  if (existing) {
    throw new ApiError(409, "You already have a bid on this brief — update or withdraw it instead");
  }

  const bid = await prisma.bid.create({
    data: {
      briefId,
      creatorId,
      price: input.price,
      deliveryDays: input.deliveryDays,
      note: input.note,
    },
  });

  await createNotification(brief.clientId, "bid_received", {
    brief_id: briefId,
    bid_id: bid.id,
    price: input.price,
  });

  return bid;
}

export async function listBidsForBrief(briefId: string, clientId: string) {
  const brief = await prisma.brief.findUnique({ where: { id: briefId } });
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");

  return prisma.bid.findMany({
    where: { briefId },
    include: { creator: { select: { userId: true, avatarUrl: true, avgRating: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function listMyBids(creatorId: string) {
  return prisma.bid.findMany({
    where: { creatorId },
    include: { brief: true },
    orderBy: { createdAt: "desc" },
  });
}

export interface UpdateBidInput {
  price?: number;
  deliveryDays?: number;
  note?: string;
}

async function getOwnedPendingBid(bidId: string, creatorId: string) {
  const bid = await prisma.bid.findUnique({ where: { id: bidId } });
  if (!bid) throw new ApiError(404, "Bid not found");
  if (bid.creatorId !== creatorId) throw new ApiError(403, "Not your bid");
  if (bid.status !== "pending") throw new ApiError(409, "Can only change a bid while it's pending");
  return bid;
}

// Not in the doc's §3.4 table, but rule 8 requires it: "a creator must
// update/withdraw an existing bid rather than create a second one" — with no
// endpoint to do either, that rule had nothing to enforce it.
export async function updateBid(bidId: string, creatorId: string, input: UpdateBidInput) {
  await getOwnedPendingBid(bidId, creatorId);

  return prisma.bid.update({
    where: { id: bidId },
    data: { price: input.price, deliveryDays: input.deliveryDays, note: input.note },
  });
}

// Hard delete (not a `withdrawn` status — BidStatus doesn't have one) so the
// UNIQUE(brief_id, creator_id) constraint frees up and the creator can submit a
// fresh bid afterwards.
export async function withdrawBid(bidId: string, creatorId: string) {
  await getOwnedPendingBid(bidId, creatorId);
  await prisma.bid.delete({ where: { id: bidId } });
}

export async function acceptBid(bidId: string, clientId: string) {
  const bid = await prisma.bid.findUnique({ where: { id: bidId }, include: { brief: true } });
  if (!bid) throw new ApiError(404, "Bid not found");
  if (bid.brief.clientId !== clientId) throw new ApiError(403, "Not your brief");
  if (bid.brief.status !== "open") throw new ApiError(409, "This brief is no longer open");
  if (bid.status !== "pending") throw new ApiError(409, "This bid is no longer pending");

  const deal = await prisma.$transaction(async (tx) => {
    await tx.bid.update({ where: { id: bid.id }, data: { status: "accepted" } });

    await tx.bid.updateMany({
      where: { briefId: bid.briefId, id: { not: bid.id }, status: "pending" },
      data: { status: "declined" },
    });

    await tx.brief.update({ where: { id: bid.briefId }, data: { status: "in_progress" } });

    return tx.deal.create({
      data: {
        clientId,
        creatorId: bid.creatorId,
        briefId: bid.briefId,
        source: "bid",
        agreedPrice: bid.price,
      },
    });
  });

  // Unlike direct offers, a bid never had its own thread — this is the first
  // point one needs to exist for this client/creator pair.
  await getOrCreateThread(clientId, bid.creatorId, { dealId: deal.id, briefId: bid.briefId });

  return deal;
}
