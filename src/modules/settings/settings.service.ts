import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";

export async function getMe(userId: string) {
  // Explicit select, not include: `omit` isn't in this Prisma Client's
  // generated types (still preview-gated), and `include` alone would return
  // every scalar column — passwordHash included. A live test caught exactly
  // that leak before this was added.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      oauthProviders: true,
      activeRole: true,
      hasClientProfile: true,
      hasCreatorProfile: true,
      notificationPrefs: true,
      createdAt: true,
      updatedAt: true,
      clientProfile: true,
      creatorProfile: true,
    },
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export interface UpdateMeInput {
  avatarUrl?: string;
  notificationPrefs?: Prisma.InputJsonObject;
}

// avatar_url isn't a User column (§2.1 only puts it on ClientProfile/
// CreatorProfile) — kept in sync across whichever profile(s) exist rather than
// picking just the currently-active one, since it's the same person's photo
// either way and screen 26 is described as "one settings screen shared by both
// roles."
export async function updateMe(userId: string, input: UpdateMeInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  await prisma.$transaction(async (tx) => {
    if (input.notificationPrefs !== undefined) {
      await tx.user.update({ where: { id: userId }, data: { notificationPrefs: input.notificationPrefs } });
    }
    if (input.avatarUrl !== undefined) {
      if (user.hasClientProfile) {
        await tx.clientProfile.update({ where: { userId }, data: { avatarUrl: input.avatarUrl } });
      }
      if (user.hasCreatorProfile) {
        await tx.creatorProfile.update({ where: { userId }, data: { avatarUrl: input.avatarUrl } });
      }
    }
  });

  return getMe(userId);
}
