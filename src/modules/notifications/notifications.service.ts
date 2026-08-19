import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import type { NotificationType } from "../../lib/vocabularies";

// Exported for other modules to call at their own event points (bid received,
// offer countered, escrow funded, draft submitted/approved, review received) —
// payload should carry enough to deep-link (deal_id, amounts, etc.) per §2.7.
export async function createNotification(
  userId: string,
  type: NotificationType,
  payload: Prisma.InputJsonObject,
) {
  return prisma.notification.create({ data: { userId, type, payload } });
}

export async function listNotifications(userId: string, unreadOnly?: boolean) {
  return prisma.notification.findMany({
    where: { userId, readAt: unreadOnly ? null : undefined },
    orderBy: { createdAt: "desc" },
  });
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new ApiError(404, "Notification not found");
  if (notification.userId !== userId) throw new ApiError(403, "Not your notification");

  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}
