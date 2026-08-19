import { db } from "../../db";
import { newId } from "../../lib/id";
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
  const profile = await db.selectFrom("creatorProfiles").selectAll().where("userId", "=", userId).executeTakeFirst();
  if (!profile) {
    throw new ApiError(403, "Switch to the creator role before editing a creator profile");
  }

  // Kysely's .set() drops undefined-valued keys (same partial-update semantics
  // Prisma had) — but an all-undefined input (empty PATCH body) would leave no
  // SET clause at all, which MySQL rejects, so skip the write entirely then.
  const hasUpdates = Object.values(input).some((v) => v !== undefined);
  if (hasUpdates) {
    await db
      .updateTable("creatorProfiles")
      .set({
        name: input.name,
        bio: input.bio,
        // JSON.stringify(undefined) is itself undefined, so "not provided"
        // still correctly skips the column — mysql2 needs an actual JSON
        // string for a JSON column, not a raw JS array passed as a param.
        niches: input.niches ? JSON.stringify(input.niches) : undefined,
        startingRate: input.startingRate,
        typicalTurnaroundDays: input.typicalTurnaroundDays,
      })
      .where("userId", "=", userId)
      .execute();
  }

  return db.selectFrom("creatorProfiles").selectAll().where("userId", "=", userId).executeTakeFirstOrThrow();
}

// §5: portfolio images go through a pre-signed S3 URL for direct client upload,
// not proxied through the API server — resolves the contradiction flagged
// earlier between §3.2 ("multipart file") and §5 ("don't proxy large files
// through the API server"): mediaUrl is expected to already point at S3 by the
// time this is called.
export async function addPortfolioItem(userId: string, mediaUrl: string) {
  const profile = await db.selectFrom("creatorProfiles").select("userId").where("userId", "=", userId).executeTakeFirst();
  if (!profile) {
    throw new ApiError(403, "Switch to the creator role before adding portfolio items");
  }

  const { count } = await db
    .selectFrom("portfolioItems")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .where("creatorId", "=", userId)
    .executeTakeFirstOrThrow();

  const id = newId();
  await db.insertInto("portfolioItems").values({ id, creatorId: userId, mediaUrl, sortOrder: Number(count) }).execute();

  return db.selectFrom("portfolioItems").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function deletePortfolioItem(userId: string, itemId: string) {
  const item = await db.selectFrom("portfolioItems").selectAll().where("id", "=", itemId).executeTakeFirst();
  if (!item) throw new ApiError(404, "Portfolio item not found");
  if (item.creatorId !== userId) throw new ApiError(403, "Not your portfolio item");

  await db.deleteFrom("portfolioItems").where("id", "=", itemId).execute();
}
