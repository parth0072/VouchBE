import { db } from "../../db";
import type { BriefFormat } from "../../db/types";
import { newId } from "../../lib/id";
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
  const creator = await db.selectFrom("creatorProfiles").select("userId").where("userId", "=", input.creatorId).executeTakeFirst();
  if (!creator) throw new ApiError(404, "Creator not found");

  if (input.briefId) {
    const brief = await db.selectFrom("briefs").select(["id", "clientId"]).where("id", "=", input.briefId).executeTakeFirst();
    if (!brief) throw new ApiError(404, "Brief not found");
    if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");
  }

  await getOrCreateThread(clientId, input.creatorId, { briefId: input.briefId });

  const id = newId();
  await db
    .insertInto("directOffers")
    .values({
      id,
      clientId,
      creatorId: input.creatorId,
      briefId: input.briefId ?? null,
      price: input.price,
      format: input.format,
      turnaroundDays: input.turnaroundDays,
      message: input.message,
    })
    .execute();

  return db.selectFrom("directOffers").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function listMyOffers(userId: string) {
  return db
    .selectFrom("directOffers")
    .selectAll()
    .where((eb) => eb.or([eb("clientId", "=", userId), eb("creatorId", "=", userId)]))
    .orderBy("createdAt", "desc")
    .execute();
}

function assertParticipant(offer: { clientId: string; creatorId: string }, userId: string) {
  if (offer.clientId !== userId && offer.creatorId !== userId) {
    throw new ApiError(403, "Not a participant on this offer");
  }
}

export async function getOfferById(offerId: string, userId: string) {
  const offer = await db.selectFrom("directOffers").selectAll().where("id", "=", offerId).executeTakeFirst();
  if (!offer) throw new ApiError(404, "Offer not found");
  assertParticipant(offer, userId);

  const revisions = await db
    .selectFrom("offerRevisions")
    .selectAll()
    .where("offerId", "=", offerId)
    .orderBy("createdAt", "asc")
    .execute();

  return { ...offer, revisions };
}

async function getActiveOfferForParticipant(offerId: string, userId: string) {
  const offer = await db.selectFrom("directOffers").selectAll().where("id", "=", offerId).executeTakeFirst();
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

  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("offerRevisions")
      .values({
        id: newId(),
        offerId,
        proposedBy,
        price: input.price,
        turnaroundDays: input.turnaroundDays,
        note: input.note,
      })
      .execute();

    await trx
      .updateTable("directOffers")
      .set({ price: input.price, turnaroundDays: input.turnaroundDays, status: "countered" })
      .where("id", "=", offerId)
      .execute();
  });
  const updated = await db.selectFrom("directOffers").selectAll().where("id", "=", offerId).executeTakeFirstOrThrow();

  await createNotification(recipientId, "offer_countered", {
    offer_id: offerId,
    price: input.price,
  });

  return updated;
}

export async function acceptOffer(offerId: string, userId: string) {
  const offer = await getActiveOfferForParticipant(offerId, userId);

  const dealId = newId();
  await db.transaction().execute(async (trx) => {
    await trx.updateTable("directOffers").set({ status: "accepted" }).where("id", "=", offerId).execute();

    await trx
      .insertInto("deals")
      .values({
        id: dealId,
        clientId: offer.clientId,
        creatorId: offer.creatorId,
        briefId: offer.briefId,
        offerId: offer.id,
        source: "direct_offer",
        agreedPrice: Number(offer.price),
        updatedAt: new Date(),
      })
      .execute();
  });
  const deal = await db.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirstOrThrow();

  // Thread already exists from createOffer() — this just attaches the new
  // deal id. Outside the transaction above: getOrCreateThread runs on its own
  // connection, and leaving a thread's dealId unset if this fails is a cosmetic
  // gap, not a correctness one — the Deal record is already safely committed.
  await getOrCreateThread(offer.clientId, offer.creatorId, { dealId: deal.id });

  return deal;
}

export async function declineOffer(offerId: string, userId: string) {
  await getActiveOfferForParticipant(offerId, userId);
  await db.updateTable("directOffers").set({ status: "declined" }).where("id", "=", offerId).execute();
  return db.selectFrom("directOffers").selectAll().where("id", "=", offerId).executeTakeFirstOrThrow();
}
