import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import { NICHES } from "../../lib/vocabularies";
import * as briefsService from "./briefs.service";

const BRIEF_FORMATS = ["reel", "ugc", "youtube", "tiktok", "photo"] as const;

const createBriefSchema = z.object({
  title: z.string().min(1),
  format: z.enum(BRIEF_FORMATS),
  niche: z.enum(NICHES),
  description: z.string().min(1),
  budget_min: z.number().nonnegative(),
  budget_max: z.number().nonnegative(),
  deadline: z.coerce.date(),
  reference_images: z.array(z.string().url()).default([]),
});

export async function createBrief(req: Request, res: Response) {
  const body = createBriefSchema.parse(req.body);
  const brief = await briefsService.createBrief(req.user!.id, {
    title: body.title,
    format: body.format,
    niche: body.niche,
    description: body.description,
    budgetMin: body.budget_min,
    budgetMax: body.budget_max,
    deadline: body.deadline,
    referenceImages: body.reference_images,
  });
  res.status(201).json(toSnakeCase(brief));
}

const listMineQuerySchema = z.object({
  status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
});

export async function listMine(req: Request, res: Response) {
  const { status } = listMineQuerySchema.parse(req.query);
  const briefs = await briefsService.listMyBriefs(req.user!.id, status);
  res.json(toSnakeCase(briefs));
}

const feedQuerySchema = z.object({
  niche: z.enum(NICHES).optional(),
  budget_min: z.coerce.number().nonnegative().optional(),
  format: z.enum(BRIEF_FORMATS).optional(),
});

export async function getFeed(req: Request, res: Response) {
  const query = feedQuerySchema.parse(req.query);
  const briefs = await briefsService.getBriefFeed(req.user!.id, {
    niche: query.niche,
    budgetMin: query.budget_min,
    format: query.format,
  });
  res.json(toSnakeCase(briefs));
}

export async function getById(req: Request, res: Response) {
  const brief = await briefsService.getBriefById(req.params.id);
  res.json(toSnakeCase(brief));
}

const updateBriefSchema = z.object({
  title: z.string().min(1).optional(),
  format: z.enum(BRIEF_FORMATS).optional(),
  niche: z.enum(NICHES).optional(),
  description: z.string().min(1).optional(),
  budget_min: z.number().nonnegative().optional(),
  budget_max: z.number().nonnegative().optional(),
  deadline: z.coerce.date().optional(),
});

export async function update(req: Request, res: Response) {
  const body = updateBriefSchema.parse(req.body);
  const brief = await briefsService.updateBrief(req.params.id, req.user!.id, {
    title: body.title,
    format: body.format,
    niche: body.niche,
    description: body.description,
    budgetMin: body.budget_min,
    budgetMax: body.budget_max,
    deadline: body.deadline,
  });
  res.json(toSnakeCase(brief));
}

export async function cancel(req: Request, res: Response) {
  const brief = await briefsService.cancelBrief(req.params.id, req.user!.id);
  res.json(toSnakeCase(brief));
}
