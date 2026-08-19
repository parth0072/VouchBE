import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import type { Niche } from "../../lib/vocabularies";

export interface UpdateCreatorProfileInput {
  name?: string;
  bio?: string;
  niches?: Niche[];
  startingRate?: number;
  typicalTurnaroundDays?: number;
}

export async function updateCreatorProfile(userId: string, input: UpdateCreatorProfileInput) {
  const profile = await prisma.creatorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new ApiError(403, "Switch to the creator role before editing a creator profile");
  }

  return prisma.creatorProfile.update({
    where: { userId },
    data: {
      name: input.name,
      bio: input.bio,
      niches: input.niches,
      startingRate: input.startingRate,
      typicalTurnaroundDays: input.typicalTurnaroundDays,
    },
  });
}

// §5: portfolio images go through a pre-signed S3 URL for direct client upload,
// not proxied through the API server — resolves the contradiction flagged
// earlier between §3.2 ("multipart file") and §5 ("don't proxy large files
// through the API server"): mediaUrl is expected to already point at S3 by the
// time this is called.
export async function addPortfolioItem(userId: string, mediaUrl: string) {
  const profile = await prisma.creatorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new ApiError(403, "Switch to the creator role before adding portfolio items");
  }

  const count = await prisma.portfolioItem.count({ where: { creatorId: userId } });

  return prisma.portfolioItem.create({
    data: { creatorId: userId, mediaUrl, sortOrder: count },
  });
}

export async function deletePortfolioItem(userId: string, itemId: string) {
  const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item) throw new ApiError(404, "Portfolio item not found");
  if (item.creatorId !== userId) throw new ApiError(403, "Not your portfolio item");

  await prisma.portfolioItem.delete({ where: { id: itemId } });
}
