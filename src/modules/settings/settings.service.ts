import { db } from "../../db";
import { ApiError } from "../../lib/apiError";

export async function getMe(userId: string) {
  // select(), not selectAll(): passwordHash is deliberately excluded — a live
  // test once caught it leaking through an unfiltered fetch.
  const user = await db
    .selectFrom("users")
    .select([
      "id",
      "email",
      "oauthProviders",
      "activeRole",
      "hasClientProfile",
      "hasCreatorProfile",
      "notificationPrefs",
      "createdAt",
      "updatedAt",
    ])
    .where("id", "=", userId)
    .executeTakeFirst();
  if (!user) throw new ApiError(404, "User not found");

  const [clientProfile, creatorProfile] = await Promise.all([
    user.hasClientProfile
      ? db.selectFrom("clientProfiles").selectAll().where("userId", "=", userId).executeTakeFirst()
      : Promise.resolve(null),
    user.hasCreatorProfile
      ? db.selectFrom("creatorProfiles").selectAll().where("userId", "=", userId).executeTakeFirst()
      : Promise.resolve(null),
  ]);

  return { ...user, clientProfile: clientProfile ?? null, creatorProfile: creatorProfile ?? null };
}

export interface UpdateMeInput {
  avatarUrl?: string;
  notificationPrefs?: Record<string, unknown>;
}

// avatar_url isn't a User column (§2.1 only puts it on ClientProfile/
// CreatorProfile) — kept in sync across whichever profile(s) exist rather than
// picking just the currently-active one, since it's the same person's photo
// either way and screen 26 is described as "one settings screen shared by both
// roles."
export async function updateMe(userId: string, input: UpdateMeInput) {
  const user = await db.selectFrom("users").select(["hasClientProfile", "hasCreatorProfile"]).where("id", "=", userId).executeTakeFirst();
  if (!user) throw new ApiError(404, "User not found");

  await db.transaction().execute(async (trx) => {
    if (input.notificationPrefs !== undefined) {
      await trx
        .updateTable("users")
        .set({ notificationPrefs: JSON.stringify(input.notificationPrefs), updatedAt: new Date() })
        .where("id", "=", userId)
        .execute();
    }
    if (input.avatarUrl !== undefined) {
      if (user.hasClientProfile) {
        await trx.updateTable("clientProfiles").set({ avatarUrl: input.avatarUrl }).where("userId", "=", userId).execute();
      }
      if (user.hasCreatorProfile) {
        await trx.updateTable("creatorProfiles").set({ avatarUrl: input.avatarUrl }).where("userId", "=", userId).execute();
      }
    }
  });

  return getMe(userId);
}
