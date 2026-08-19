import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { assertThreadParticipant } from "./threads.service";

const PAGE_SIZE = 30;

export async function listMessages(threadId: string, userId: string, before?: string) {
  await assertThreadParticipant(threadId, userId);

  let cursorCreatedAt: Date | undefined;
  if (before) {
    const cursorMessage = await db.selectFrom("messages").select("createdAt").where("id", "=", before).executeTakeFirst();
    cursorCreatedAt = cursorMessage?.createdAt;
  }

  return db
    .selectFrom("messages")
    .selectAll()
    .where("threadId", "=", threadId)
    .$if(cursorCreatedAt !== undefined, (qb) => qb.where("createdAt", "<", cursorCreatedAt as Date))
    .orderBy("createdAt", "desc")
    .limit(PAGE_SIZE)
    .execute();
}

export interface SendMessageInput {
  text?: string;
  attachmentUrl?: string;
}

export async function sendMessage(threadId: string, senderId: string, input: SendMessageInput) {
  await assertThreadParticipant(threadId, senderId);

  if (!input.text && !input.attachmentUrl) {
    throw new ApiError(400, "Message needs text or an attachment");
  }

  const id = newId();
  await db
    .insertInto("messages")
    .values({ id, threadId, senderId, text: input.text, attachmentUrl: input.attachmentUrl })
    .execute();

  return db.selectFrom("messages").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}
