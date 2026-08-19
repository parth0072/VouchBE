import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import { REVIEW_TAGS } from "../../lib/vocabularies";
import * as reviewsService from "./reviews.service";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  tags: z.array(z.enum(REVIEW_TAGS)).default([]),
  comment: z.string().max(2000).optional(),
});

export async function create(req: Request, res: Response) {
  const body = createReviewSchema.parse(req.body);
  const review = await reviewsService.createReview(req.params.id, req.user!.id, body);
  res.status(201).json(toSnakeCase(review));
}

export async function listForUser(req: Request, res: Response) {
  const result = await reviewsService.getReviewsForUser(req.params.id);
  res.json(toSnakeCase(result));
}
