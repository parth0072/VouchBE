import { db } from "../../db";
import { newId } from "../../lib/id";

export async function registerPushToken(userId: string, platform: string, token: string) {
  await db
    .insertInto("pushTokens")
    .values({ id: newId(), userId, platform, token })
    .onDuplicateKeyUpdate({ platform })
    .execute();

  return db
    .selectFrom("pushTokens")
    .selectAll()
    .where("userId", "=", userId)
    .where("token", "=", token)
    .executeTakeFirstOrThrow();
}
