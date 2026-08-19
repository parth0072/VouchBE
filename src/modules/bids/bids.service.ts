import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { getOrCreateThread } from "../messaging/threads.service";
import { createNotification } from "../notifications/notifications.service";

export interface CreateBidInput {
  price: number;
  deliveryDays: number;
  note?: string;
}

export async function createBid(briefId: string, creatorId: string, input: CreateBidInput) {
  const brief = await db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirst();
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.status !== "open") throw new ApiError(409, "This brief is no longer open for bids");

  const existing = await db
    .selectFrom("bids")
    .select("id")
    .where("briefId", "=", briefId)
    .where("creatorId", "=", creatorId)
    .executeTakeFirst();
  if (existing) {
    throw new ApiError(409, "You already have a bid on this brief — update or withdraw it instead");
  }

  const id = newId();
  await db
    .insertInto("bids")
    .values({ id, briefId, creatorId, price: input.price, deliveryDays: input.deliveryDays, note: input.note })
    .execute();
  const bid = await db.selectFrom("bids").selectAll().where("id", "=", id).executeTakeFirstOrThrow();

  await createNotification(brief.clientId, "bid_received", {
    brief_id: briefId,
    bid_id: bid.id,
    price: input.price,
  });

  return bid;
}

export async function listBidsForBrief(briefId: string, clientId: string) {
  const brief = await db.selectFrom("briefs").select(["id", "clientId"]).where("id", "=", briefId).executeTakeFirst();
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");

  const bids = await db.selectFrom("bids").selectAll().where("briefId", "=", briefId).orderBy("createdAt", "asc").execute();
  if (bids.length === 0) return [];

  const creators = await db
    .selectFrom("creatorProfiles")
    .select(["userId", "avatarUrl", "avgRating"])
    .where("userId", "in", [...new Set(bids.map((b) => b.creatorId))])
    .execute();
  const creatorById = new Map(creators.map((c) => [c.userId, c]));

  return bids.map((bid) => ({ ...bid, creator: creatorById.get(bid.creatorId) ?? null }));
}

export async function listMyBids(creatorId: string) {
  const bids = await db.selectFrom("bids").selectAll().where("creatorId", "=", creatorId).orderBy("createdAt", "desc").execute();
  if (bids.length === 0) return [];

  const briefs = await db
    .selectFrom("briefs")
    .selectAll()
    .where("id", "in", [...new Set(bids.map((b) => b.briefId))])
    .execute();
  const briefById = new Map(briefs.map((b) => [b.id, b]));

  return bids.map((bid) => ({ ...bid, brief: briefById.get(bid.briefId) ?? null }));
}

export interface UpdateBidInput {
  price?: number;
  deliveryDays?: number;
  note?: string;
}

async function getOwnedPendingBid(bidId: string, creatorId: string) {
  const bid = await db.selectFrom("bids").selectAll().where("id", "=", bidId).executeTakeFirst();
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

  const hasUpdates = Object.values(input).some((v) => v !== undefined);
  if (hasUpdates) {
    await db
      .updateTable("bids")
      .set({ price: input.price, deliveryDays: input.deliveryDays, note: input.note })
      .where("id", "=", bidId)
      .execute();
  }

  return db.selectFrom("bids").selectAll().where("id", "=", bidId).executeTakeFirstOrThrow();
}

// Hard delete (not a `withdrawn` status — BidStatus doesn't have one) so the
// UNIQUE(brief_id, creator_id) constraint frees up and the creator can submit a
// fresh bid afterwards.
export async function withdrawBid(bidId: string, creatorId: string) {
  await getOwnedPendingBid(bidId, creatorId);
  await db.deleteFrom("bids").where("id", "=", bidId).execute();
}

export async function acceptBid(bidId: string, clientId: string) {
  const bid = await db.selectFrom("bids").selectAll().where("id", "=", bidId).executeTakeFirst();
  if (!bid) throw new ApiError(404, "Bid not found");
  const brief = await db.selectFrom("briefs").selectAll().where("id", "=", bid.briefId).executeTakeFirstOrThrow();
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");
  if (brief.status !== "open") throw new ApiError(409, "This brief is no longer open");
  if (bid.status !== "pending") throw new ApiError(409, "This bid is no longer pending");

  const dealId = newId();
  await db.transaction().execute(async (trx) => {
    await trx.updateTable("bids").set({ status: "accepted" }).where("id", "=", bid.id).execute();

    await trx
      .updateTable("bids")
      .set({ status: "declined" })
      .where("briefId", "=", bid.briefId)
      .where("id", "!=", bid.id)
      .where("status", "=", "pending")
      .execute();

    await trx.updateTable("briefs").set({ status: "in_progress" }).where("id", "=", bid.briefId).execute();

    await trx
      .insertInto("deals")
      .values({
        id: dealId,
        clientId,
        creatorId: bid.creatorId,
        briefId: bid.briefId,
        source: "bid",
        agreedPrice: Number(bid.price),
        updatedAt: new Date(),
      })
      .execute();
  });
  const deal = await db.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirstOrThrow();

  // Unlike direct offers, a bid never had its own thread — this is the first
  // point one needs to exist for this client/creator pair.
  await getOrCreateThread(clientId, bid.creatorId, { dealId: deal.id, briefId: bid.briefId });

  return deal;
}
