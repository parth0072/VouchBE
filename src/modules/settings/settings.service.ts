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
      "name",
      "avatarUrl",
      "emailVerifiedAt",
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
  name?: string;
  avatarUrl?: string;
  notificationPrefs?: Record<string, unknown>;
}

// avatar_url is on users AND (once they exist) on client_profiles/
// creator_profiles — written to users always (that's the only place it can
// go for the prototype's "Add a profile photo" step, which runs before
// role-select creates either profile row), and synced into whichever
// profile(s) already exist too, since creator search/bids/etc. still read
// avatar_url from the profile tables, not from users.
export async function updateMe(userId: string, input: UpdateMeInput) {
  const user = await db.selectFrom("users").select(["hasClientProfile", "hasCreatorProfile"]).where("id", "=", userId).executeTakeFirst();
  if (!user) throw new ApiError(404, "User not found");

  await db.transaction().execute(async (trx) => {
    if (input.name !== undefined || input.avatarUrl !== undefined || input.notificationPrefs !== undefined) {
      await trx
        .updateTable("users")
        .set({
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
          ...(input.notificationPrefs !== undefined ? { notificationPrefs: JSON.stringify(input.notificationPrefs) } : {}),
          updatedAt: new Date(),
        })
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
