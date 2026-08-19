import { db } from "../../db";
import type { SocialAccountsTable } from "../../db/types";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { buildOAuthUrl, exchangeCodeForStats } from "./oauthProviders";

type SocialPlatform = SocialAccountsTable["platform"];

export function getOAuthUrl(platform: SocialPlatform) {
  return buildOAuthUrl(platform);
}

export async function handleCallback(userId: string, platform: SocialPlatform, code: string) {
  const profile = await db.selectFrom("creatorProfiles").select("userId").where("userId", "=", userId).executeTakeFirst();
  if (!profile) {
    throw new ApiError(403, "Switch to the creator role before linking a social account");
  }

  const stats = await exchangeCodeForStats(platform, code);
  const lastSyncedAt = new Date();

  // MySQL upsert via ON DUPLICATE KEY UPDATE, keyed on the UNIQUE(creator_id,
  // platform) constraint — no RETURNING, so a separate select follows.
  await db
    .insertInto("socialAccounts")
    .values({
      id: newId(),
      creatorId: userId,
      platform,
      handle: stats.handle,
      followerCount: stats.followerCount,
      engagementRate: stats.engagementRate,
      verified: true,
      oauthTokenRef: stats.oauthTokenRef,
      lastSyncedAt,
    })
    .onDuplicateKeyUpdate({
      handle: stats.handle,
      followerCount: stats.followerCount,
      engagementRate: stats.engagementRate,
      verified: true,
      oauthTokenRef: stats.oauthTokenRef,
      lastSyncedAt,
    })
    .execute();

  return db
    .selectFrom("socialAccounts")
    .selectAll()
    .where("creatorId", "=", userId)
    .where("platform", "=", platform)
    .executeTakeFirstOrThrow();
}

export async function deleteSocialAccount(userId: string, socialAccountId: string) {
  const account = await db.selectFrom("socialAccounts").selectAll().where("id", "=", socialAccountId).executeTakeFirst();
  if (!account) throw new ApiError(404, "Social account not found");
  if (account.creatorId !== userId) throw new ApiError(403, "Not your social account");

  await db.deleteFrom("socialAccounts").where("id", "=", socialAccountId).execute();
}
