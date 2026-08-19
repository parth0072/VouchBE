import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as threadsService from "./threads.service";
import * as messagesService from "./messages.service";

export async function listThreads(req: Request, res: Response) {
  const threads = await threadsService.listMyThreads(req.user!.id);
  res.json(toSnakeCase(threads));
}

const listMessagesQuerySchema = z.object({ before: z.string().uuid().optional() });

export async function listMessages(req: Request, res: Response) {
  const { before } = listMessagesQuerySchema.parse(req.query);
  const messages = await messagesService.listMessages(req.params.id, req.user!.id, before);
  res.json(toSnakeCase(messages));
}

const sendMessageSchema = z.object({
  text: z.string().min(1).optional(),
  attachment_url: z.string().url().optional(),
});

export async function sendMessage(req: Request, res: Response) {
  const body = sendMessageSchema.parse(req.body);
  const message = await messagesService.sendMessage(req.params.id, req.user!.id, {
    text: body.text,
    attachmentUrl: body.attachment_url,
  });
  res.status(201).json(toSnakeCase(message));
}
