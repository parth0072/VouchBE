import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import type { ReviewTag } from "../../lib/vocabularies";
import { createNotification } from "../notifications/notifications.service";

export interface CreateReviewInput {
  rating: number;
  tags: ReviewTag[];
  comment?: string;
}

// §4 rule 7: only postable once Deal.status = completed, enforced here (not
// just hidden client-side).
export async function createReview(dealId: string, reviewerId: string, input: CreateReviewInput) {
  const deal = await db.selectFrom("deals").selectAll().where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.clientId !== reviewerId && deal.creatorId !== reviewerId) {
    throw new ApiError(403, "Not a participant on this deal");
  }
  if (deal.status !== "completed") {
    throw new ApiError(409, "Can only review a deal after it's completed");
  }

  const revieweeId = deal.clientId === reviewerId ? deal.creatorId : deal.clientId;

  const id = newId();
  await db
    .insertInto("reviews")
    .values({ id, dealId, reviewerId, revieweeId, rating: input.rating, tags: JSON.stringify(input.tags), comment: input.comment })
    .execute();
  const review = await db.selectFrom("reviews").selectAll().where("id", "=", id).executeTakeFirstOrThrow();

  // avg_rating/review_count only live on CreatorProfile (§2.1) — ClientProfile
  // has no equivalent, and no screen in the design shows a client-side rating,
  // so a creator reviewing a client just stores the row with nothing to
  // recompute.
  const revieweeCreatorProfile = await db.selectFrom("creatorProfiles").select("userId").where("userId", "=", revieweeId).executeTakeFirst();
  if (revieweeCreatorProfile) {
    const agg = await db
      .selectFrom("reviews")
      .select((eb) => [eb.fn.avg<string | null>("rating").as("avgRating"), eb.fn.countAll<number>().as("count")])
      .where("revieweeId", "=", revieweeId)
      .executeTakeFirstOrThrow();

    await db
      .updateTable("creatorProfiles")
      .set({ avgRating: Number(agg.avgRating ?? 0), reviewCount: Number(agg.count) })
      .where("userId", "=", revieweeId)
      .execute();
  }

  await createNotification(revieweeId, "review_received", { deal_id: dealId, rating: input.rating });

  return review;
}

export async function getReviewsForUser(userId: string) {
  const reviews = await db.selectFrom("reviews").selectAll().where("revieweeId", "=", userId).orderBy("createdAt", "desc").execute();

  const creatorProfile = await db
    .selectFrom("creatorProfiles")
    .select(["avgRating", "reviewCount"])
    .where("userId", "=", userId)
    .executeTakeFirst();

  return {
    avgRating: creatorProfile?.avgRating ?? null,
    reviewCount: creatorProfile?.reviewCount ?? reviews.length,
    reviews,
  };
}
