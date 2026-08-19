import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import { NICHES } from "../../lib/vocabularies";
import * as socialAccountsService from "./socialAccounts.service";
import * as creatorProfileService from "./creatorProfile.service";

const platformParamSchema = z.object({
  platform: z.enum(["instagram", "tiktok", "youtube", "facebook"]),
});

export async function getOAuthUrl(req: Request, res: Response) {
  const { platform } = platformParamSchema.parse(req.params);
  const url = socialAccountsService.getOAuthUrl(platform);
  res.json({ url });
}

const callbackSchema = z.object({ code: z.string() });

export async function handleCallback(req: Request, res: Response) {
  const { platform } = platformParamSchema.parse(req.params);
  const { code } = callbackSchema.parse(req.body);
  const account = await socialAccountsService.handleCallback(req.user!.id, platform, code);
  res.json(toSnakeCase(account));
}

export async function deleteSocialAccount(req: Request, res: Response) {
  await socialAccountsService.deleteSocialAccount(req.user!.id, req.params.id);
  res.status(204).send();
}

const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  bio: z.string().max(2000).optional(),
  niches: z.array(z.enum(NICHES)).optional(),
  starting_rate: z.number().positive().optional(),
  typical_turnaround_days: z.number().int().positive().optional(),
});

export async function updateCreatorProfile(req: Request, res: Response) {
  const body = updateProfileSchema.parse(req.body);
  const profile = await creatorProfileService.updateCreatorProfile(req.user!.id, {
    name: body.name,
    bio: body.bio,
    niches: body.niches,
    startingRate: body.starting_rate,
    typicalTurnaroundDays: body.typical_turnaround_days,
  });
  res.json(toSnakeCase(profile));
}

const addPortfolioItemSchema = z.object({ media_url: z.string().url() });

export async function addPortfolioItem(req: Request, res: Response) {
  const { media_url } = addPortfolioItemSchema.parse(req.body);
  const item = await creatorProfileService.addPortfolioItem(req.user!.id, media_url);
  res.status(201).json(toSnakeCase(item));
}

export async function deletePortfolioItem(req: Request, res: Response) {
  await creatorProfileService.deletePortfolioItem(req.user!.id, req.params.id);
  res.status(204).send();
}
