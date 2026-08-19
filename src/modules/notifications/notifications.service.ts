import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import type { NotificationType } from "../../lib/vocabularies";

// Exported for other modules to call at their own event points (bid received,
// offer countered, escrow funded, draft submitted/approved, review received) —
// payload should carry enough to deep-link (deal_id, amounts, etc.) per §2.7.
export async function createNotification(userId: string, type: NotificationType, payload: Record<string, unknown>) {
  const id = newId();
  // JSON columns need an actual JSON string from mysql2/Kysely, not a raw JS
  // object passed as a param — a live test caught "Invalid JSON text" without this.
  await db.insertInto("notifications").values({ id, userId, type, payload: JSON.stringify(payload) }).execute();
  return db.selectFrom("notifications").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function listNotifications(userId: string, unreadOnly?: boolean) {
  return db
    .selectFrom("notifications")
    .selectAll()
    .where("userId", "=", userId)
    .$if(Boolean(unreadOnly), (qb) => qb.where("readAt", "is", null))
    .orderBy("createdAt", "desc")
    .execute();
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await db.selectFrom("notifications").selectAll().where("id", "=", notificationId).executeTakeFirst();
  if (!notification) throw new ApiError(404, "Notification not found");
  if (notification.userId !== userId) throw new ApiError(403, "Not your notification");

  await db.updateTable("notifications").set({ readAt: new Date() }).where("id", "=", notificationId).execute();
  return db.selectFrom("notifications").selectAll().where("id", "=", notificationId).executeTakeFirstOrThrow();
}
