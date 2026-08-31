import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as settingsService from "./settings.service";

export async function getMe(req: Request, res: Response) {
  const user = await settingsService.getMe(req.user!.id);
  res.json(toSnakeCase(user));
}

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  avatar_url: z.string().url().optional(),
  notification_prefs: z.record(z.unknown()).optional(),
});

export async function updateMe(req: Request, res: Response) {
  const body = updateMeSchema.parse(req.body);
  const user = await settingsService.updateMe(req.user!.id, {
    name: body.name,
    avatarUrl: body.avatar_url,
    notificationPrefs: body.notification_prefs,
  });
  res.json(toSnakeCase(user));
}
