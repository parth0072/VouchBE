import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";

export interface SearchCreatorsFilters {
  q?: string;
  niche?: string;
  followersMin?: number;
  followersMax?: number;
  budgetMax?: number;
}

function withVerified<T extends { socialAccounts: { verified: boolean }[] }>(profile: T) {
  return { ...profile, isVerified: profile.socialAccounts.some((a) => a.verified) };
}

// niche/q matching happens in application code rather than as a Prisma `Json`
// query filter: MySQL's JSON array-containment operators are newer/less portable
// than the relational filters below, and can't be verified without a live DB in
// front of me right now. Fine at v1 search volume; worth moving to the DB (or a
// normalized creator_niches join table) once it isn't.
export async function searchCreators(filters: SearchCreatorsFilters) {
  const candidates = await prisma.creatorProfile.findMany({
    where: {
      startingRate: filters.budgetMax ? { lte: filters.budgetMax } : undefined,
      socialAccounts:
        filters.followersMin !== undefined || filters.followersMax !== undefined
          ? {
              some: {
                followerCount: {
                  gte: filters.followersMin,
                  lte: filters.followersMax,
                },
              },
            }
          : undefined,
    },
    include: { socialAccounts: true },
    orderBy: { avgRating: "desc" },
  });

  const q = filters.q?.toLowerCase();
  const niche = filters.niche?.toLowerCase();

  const filtered = candidates.filter((c) => {
    const niches = (Array.isArray(c.niches) ? (c.niches as string[]) : []).map((n) => n.toLowerCase());

    if (niche && !niches.includes(niche)) return false;
    if (q) {
      const nameMatches = c.name?.toLowerCase().includes(q) ?? false;
      const nicheMatches = niches.some((n) => n.includes(q));
      if (!nameMatches && !nicheMatches) return false;
    }
    return true;
  });

  return filtered.map(withVerified);
}

export async function getCreatorById(creatorId: string) {
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: creatorId },
    include: {
      socialAccounts: true,
      portfolioItems: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!profile) throw new ApiError(404, "Creator not found");
  return withVerified(profile);
}
