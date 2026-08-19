import type { SocialPlatform } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { buildOAuthUrl, exchangeCodeForStats } from "./oauthProviders";

export function getOAuthUrl(platform: SocialPlatform) {
  return buildOAuthUrl(platform);
}

export async function handleCallback(userId: string, platform: SocialPlatform, code: string) {
  const profile = await prisma.creatorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new ApiError(403, "Switch to the creator role before linking a social account");
  }

  const stats = await exchangeCodeForStats(platform, code);

  return prisma.socialAccount.upsert({
    where: { creatorId_platform: { creatorId: userId, platform } },
    create: {
      creatorId: userId,
      platform,
      handle: stats.handle,
      followerCount: stats.followerCount,
      engagementRate: stats.engagementRate,
      verified: true,
      oauthTokenRef: stats.oauthTokenRef,
      lastSyncedAt: new Date(),
    },
    update: {
      handle: stats.handle,
      followerCount: stats.followerCount,
      engagementRate: stats.engagementRate,
      verified: true,
      oauthTokenRef: stats.oauthTokenRef,
      lastSyncedAt: new Date(),
    },
  });
}

export async function deleteSocialAccount(userId: string, socialAccountId: string) {
  const account = await prisma.socialAccount.findUnique({ where: { id: socialAccountId } });
  if (!account) throw new ApiError(404, "Social account not found");
  if (account.creatorId !== userId) throw new ApiError(403, "Not your social account");

  await prisma.socialAccount.delete({ where: { id: socialAccountId } });
}
