import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { assertThreadParticipant } from "./threads.service";

const PAGE_SIZE = 30;

export async function listMessages(threadId: string, userId: string, before?: string) {
  await assertThreadParticipant(threadId, userId);

  return prisma.message.findMany({
    where: { threadId },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    ...(before ? { cursor: { id: before }, skip: 1 } : {}),
  });
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

  return prisma.message.create({
    data: { threadId, senderId, text: input.text, attachmentUrl: input.attachmentUrl },
  });
}
