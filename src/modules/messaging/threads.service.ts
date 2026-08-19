import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";

// Not in §3.10 — no endpoint or documented side-effect ever creates a Thread,
// yet screen 21 shows every direct offer/deal already sitting inside one (the
// "Direct offer · $600" context pill). Called from offer creation and from bid/
// offer acceptance — the two points the UI evidences a thread existing.
// participantA/B are normalized (lexicographically smaller id first) so the
// @@unique([participantAId, participantBId]) constraint actually catches (B, A)
// as the same pair as (A, B).
export async function getOrCreateThread(
  userIdX: string,
  userIdY: string,
  context: { dealId?: string; briefId?: string } = {},
) {
  const [participantAId, participantBId] = [userIdX, userIdY].sort();

  const existing = await prisma.thread.findUnique({
    where: { participantAId_participantBId: { participantAId, participantBId } },
  });
  if (existing) {
    if (context.dealId && !existing.dealId) {
      return prisma.thread.update({ where: { id: existing.id }, data: { dealId: context.dealId } });
    }
    return existing;
  }

  return prisma.thread.create({
    data: { participantAId, participantBId, dealId: context.dealId, briefId: context.briefId },
  });
}

function otherParticipantId(thread: { participantAId: string; participantBId: string }, userId: string) {
  return thread.participantAId === userId ? thread.participantBId : thread.participantAId;
}

export async function listMyThreads(userId: string) {
  const threads = await prisma.thread.findMany({
    where: { OR: [{ participantAId: userId }, { participantBId: userId }] },
    include: {
      participantA: { select: { id: true, email: true } },
      participantB: { select: { id: true, email: true } },
      deal: true,
      brief: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return threads
    .map((thread) => {
      const lastMessage = thread.messages[0];
      return {
        ...thread,
        otherParticipantId: otherParticipantId(thread, userId),
        lastMessage,
        isUnread: Boolean(lastMessage && lastMessage.senderId !== userId && !lastMessage.readAt),
        messages: undefined,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt.getTime() ?? 0;
      const bTime = b.lastMessage?.createdAt.getTime() ?? 0;
      return bTime - aTime;
    });
}

export async function assertThreadParticipant(threadId: string, userId: string) {
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) throw new ApiError(404, "Thread not found");
  if (thread.participantAId !== userId && thread.participantBId !== userId) {
    throw new ApiError(403, "Not a participant on this thread");
  }
  return thread;
}
