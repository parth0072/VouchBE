import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as settingsService from "./settings.service";

export async function getMe(req: Request, res: Response) {
  const user = await settingsService.getMe(req.user!.id);
  res.json(toSnakeCase(user));
}

const updateMeSchema = z.object({
  avatar_url: z.string().url().optional(),
  notification_prefs: z.record(z.unknown()).optional(),
});

export async function updateMe(req: Request, res: Response) {
  const body = updateMeSchema.parse(req.body);
  const user = await settingsService.updateMe(req.user!.id, {
    avatarUrl: body.avatar_url,
    // Client-supplied free-form prefs blob (e.g. {push, email_digest}) — zod
    // has already validated it's a plain object; Prisma's InputJsonObject type
    // just wants `unknown` narrowed to `any` at the boundary.
    notificationPrefs: body.notification_prefs as Prisma.InputJsonObject | undefined,
  });
  res.json(toSnakeCase(user));
}
