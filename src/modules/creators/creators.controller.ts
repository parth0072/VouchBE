import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as creatorsService from "./creators.service";

const searchQuerySchema = z.object({
  q: z.string().optional(),
  niche: z.string().optional(),
  followers_min: z.coerce.number().nonnegative().optional(),
  followers_max: z.coerce.number().nonnegative().optional(),
  budget_max: z.coerce.number().nonnegative().optional(),
});

export async function search(req: Request, res: Response) {
  const query = searchQuerySchema.parse(req.query);
  const creators = await creatorsService.searchCreators({
    q: query.q,
    niche: query.niche,
    followersMin: query.followers_min,
    followersMax: query.followers_max,
    budgetMax: query.budget_max,
  });
  res.json(toSnakeCase(creators));
}

export async function getById(req: Request, res: Response) {
  const creator = await creatorsService.getCreatorById(req.params.id);
  res.json(toSnakeCase(creator));
}
