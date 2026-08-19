import { prisma } from "../../lib/prisma";
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
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.clientId !== reviewerId && deal.creatorId !== reviewerId) {
    throw new ApiError(403, "Not a participant on this deal");
  }
  if (deal.status !== "completed") {
    throw new ApiError(409, "Can only review a deal after it's completed");
  }

  const revieweeId = deal.clientId === reviewerId ? deal.creatorId : deal.clientId;

  const review = await prisma.review.create({
    data: {
      dealId,
      reviewerId,
      revieweeId,
      rating: input.rating,
      tags: input.tags,
      comment: input.comment,
    },
  });

  // avg_rating/review_count only live on CreatorProfile (§2.1) — ClientProfile
  // has no equivalent, and no screen in the design shows a client-side rating,
  // so a creator reviewing a client just stores the row with nothing to
  // recompute.
  const revieweeCreatorProfile = await prisma.creatorProfile.findUnique({
    where: { userId: revieweeId },
  });
  if (revieweeCreatorProfile) {
    const agg = await prisma.review.aggregate({
      where: { revieweeId },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.creatorProfile.update({
      where: { userId: revieweeId },
      data: {
        avgRating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    });
  }

  await createNotification(revieweeId, "review_received", { deal_id: dealId, rating: input.rating });

  return review;
}

export async function getReviewsForUser(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId },
    orderBy: { createdAt: "desc" },
  });

  const creatorProfile = await prisma.creatorProfile.findUnique({ where: { userId } });

  return {
    avgRating: creatorProfile?.avgRating ?? null,
    reviewCount: creatorProfile?.reviewCount ?? reviews.length,
    reviews,
  };
}
