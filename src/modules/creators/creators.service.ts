import { db } from "../../db";
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

async function attachSocialAccounts<T extends { userId: string }>(profiles: T[]) {
  if (profiles.length === 0) return [];
  const accounts = await db
    .selectFrom("socialAccounts")
    .selectAll()
    .where("creatorId", "in", profiles.map((p) => p.userId))
    .execute();
  const accountsByCreator = new Map<string, typeof accounts>();
  for (const account of accounts) {
    const list = accountsByCreator.get(account.creatorId) ?? [];
    list.push(account);
    accountsByCreator.set(account.creatorId, list);
  }
  return profiles.map((profile) => ({ ...profile, socialAccounts: accountsByCreator.get(profile.userId) ?? [] }));
}

// niche/q matching happens in application code rather than as a MySQL `JSON`
// query filter: array-containment operators are newer/less portable than the
// relational filters below, and can't be verified without a live DB in front
// of me right now. Fine at v1 search volume; worth moving to the DB (or a
// normalized creator_niches join table) once it isn't.
export async function searchCreators(filters: SearchCreatorsFilters) {
  const candidates = await db
    .selectFrom("creatorProfiles")
    .selectAll()
    .$if(filters.budgetMax !== undefined, (qb) => qb.where("startingRate", "<=", String(filters.budgetMax)))
    .$if(filters.followersMin !== undefined || filters.followersMax !== undefined, (qb) =>
      qb.where((eb) =>
        eb.exists(
          eb
            .selectFrom("socialAccounts")
            .select("id")
            .whereRef("socialAccounts.creatorId", "=", "creatorProfiles.userId")
            .$if(filters.followersMin !== undefined, (sub) => sub.where("followerCount", ">=", filters.followersMin as number))
            .$if(filters.followersMax !== undefined, (sub) => sub.where("followerCount", "<=", filters.followersMax as number)),
        ),
      ),
    )
    .orderBy("avgRating", "desc")
    .execute();

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

  const withAccounts = await attachSocialAccounts(filtered);
  return withAccounts.map(withVerified);
}

export async function getCreatorById(creatorId: string) {
  const profile = await db.selectFrom("creatorProfiles").selectAll().where("userId", "=", creatorId).executeTakeFirst();
  if (!profile) throw new ApiError(404, "Creator not found");

  const portfolioItems = await db
    .selectFrom("portfolioItems")
    .selectAll()
    .where("creatorId", "=", creatorId)
    .orderBy("sortOrder", "asc")
    .execute();

  const [withAccounts] = await attachSocialAccounts([profile]);
  return withVerified({ ...withAccounts, portfolioItems });
}
