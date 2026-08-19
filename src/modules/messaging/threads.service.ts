import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";

// Not in §3.10 — no endpoint or documented side-effect ever creates a Thread,
// yet screen 21 shows every direct offer/deal already sitting inside one (the
// "Direct offer · $600" context pill). Called from offer creation and from bid/
// offer acceptance — the two points the UI evidences a thread existing.
// participantA/B are normalized (lexicographically smaller id first) so the
// unique(participantAId, participantBId) constraint actually catches (B, A)
// as the same pair as (A, B).
export async function getOrCreateThread(
  userIdX: string,
  userIdY: string,
  context: { dealId?: string; briefId?: string } = {},
) {
  const [participantAId, participantBId] = [userIdX, userIdY].sort();

  const existing = await db
    .selectFrom("threads")
    .selectAll()
    .where("participantAId", "=", participantAId)
    .where("participantBId", "=", participantBId)
    .executeTakeFirst();

  if (existing) {
    if (context.dealId && !existing.dealId) {
      await db.updateTable("threads").set({ dealId: context.dealId }).where("id", "=", existing.id).execute();
      return db.selectFrom("threads").selectAll().where("id", "=", existing.id).executeTakeFirstOrThrow();
    }
    return existing;
  }

  const id = newId();
  await db
    .insertInto("threads")
    .values({ id, participantAId, participantBId, dealId: context.dealId, briefId: context.briefId })
    .execute();
  return db.selectFrom("threads").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function otherParticipantId(thread: { participantAId: string; participantBId: string }, userId: string) {
  return thread.participantAId === userId ? thread.participantBId : thread.participantAId;
}

export async function listMyThreads(userId: string) {
  const threads = await db
    .selectFrom("threads")
    .selectAll()
    .where((eb) => eb.or([eb("participantAId", "=", userId), eb("participantBId", "=", userId)]))
    .execute();

  if (threads.length === 0) return [];

  const threadIds = threads.map((t) => t.id);
  const participantIds = [...new Set(threads.flatMap((t) => [t.participantAId, t.participantBId]))];
  const dealIds = [...new Set(threads.map((t) => t.dealId).filter((id): id is string => id !== null))];
  const briefIds = [...new Set(threads.map((t) => t.briefId).filter((id): id is string => id !== null))];

  const [participants, deals, briefs, messages] = await Promise.all([
    db.selectFrom("users").select(["id", "email"]).where("id", "in", participantIds).execute(),
    dealIds.length ? db.selectFrom("deals").selectAll().where("id", "in", dealIds).execute() : Promise.resolve([]),
    briefIds.length ? db.selectFrom("briefs").selectAll().where("id", "in", briefIds).execute() : Promise.resolve([]),
    // No per-relation LIMIT 1 in SQL the way Prisma's `messages: { take: 1 }`
    // worked — fetch every message for these threads ordered newest-first and
    // take the first one per thread in application code.
    db.selectFrom("messages").selectAll().where("threadId", "in", threadIds).orderBy("createdAt", "desc").execute(),
  ]);

  const participantById = new Map(participants.map((p) => [p.id, p]));
  const dealById = new Map(deals.map((d) => [d.id, d]));
  const briefById = new Map(briefs.map((b) => [b.id, b]));
  const lastMessageByThread = new Map<string, (typeof messages)[number]>();
  for (const message of messages) {
    if (!lastMessageByThread.has(message.threadId)) {
      lastMessageByThread.set(message.threadId, message);
    }
  }

  return threads
    .map((thread) => {
      const lastMessage = lastMessageByThread.get(thread.id);
      return {
        ...thread,
        participantA: participantById.get(thread.participantAId) ?? null,
        participantB: participantById.get(thread.participantBId) ?? null,
        deal: thread.dealId ? (dealById.get(thread.dealId) ?? null) : null,
        brief: thread.briefId ? (briefById.get(thread.briefId) ?? null) : null,
        otherParticipantId: otherParticipantId(thread, userId),
        lastMessage: lastMessage ?? null,
        isUnread: Boolean(lastMessage && lastMessage.senderId !== userId && !lastMessage.readAt),
      };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt.getTime() ?? 0;
      const bTime = b.lastMessage?.createdAt.getTime() ?? 0;
      return bTime - aTime;
    });
}

export async function assertThreadParticipant(threadId: string, userId: string) {
  const thread = await db.selectFrom("threads").selectAll().where("id", "=", threadId).executeTakeFirst();
  if (!thread) throw new ApiError(404, "Thread not found");
  if (thread.participantAId !== userId && thread.participantBId !== userId) {
    throw new ApiError(403, "Not a participant on this thread");
  }
  return thread;
}
