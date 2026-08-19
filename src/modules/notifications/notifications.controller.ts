import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as notificationsService from "./notifications.service";
import * as pushTokensService from "./pushTokens.service";

const listQuerySchema = z.object({
  unread_only: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export async function list(req: Request, res: Response) {
  const { unread_only } = listQuerySchema.parse(req.query);
  const notifications = await notificationsService.listNotifications(req.user!.id, unread_only);
  res.json(toSnakeCase(notifications));
}

export async function markRead(req: Request, res: Response) {
  const notification = await notificationsService.markRead(req.params.id, req.user!.id);
  res.json(toSnakeCase(notification));
}

const registerPushTokenSchema = z.object({
  platform: z.string().min(1),
  token: z.string().min(1),
});

export async function registerPushToken(req: Request, res: Response) {
  const body = registerPushTokenSchema.parse(req.body);
  const pushToken = await pushTokensService.registerPushToken(req.user!.id, body.platform, body.token);
  res.status(201).json(toSnakeCase(pushToken));
}
