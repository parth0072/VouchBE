import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as offersService from "./offers.service";

const BRIEF_FORMATS = ["reel", "ugc", "youtube", "tiktok", "photo"] as const;

const createOfferSchema = z.object({
  creator_id: z.string().uuid(),
  brief_id: z.string().uuid().optional(),
  price: z.number().positive(),
  format: z.enum(BRIEF_FORMATS),
  turnaround_days: z.number().int().positive(),
  message: z.string().max(2000).optional(),
});

export async function create(req: Request, res: Response) {
  const body = createOfferSchema.parse(req.body);
  const offer = await offersService.createOffer(req.user!.id, {
    creatorId: body.creator_id,
    briefId: body.brief_id,
    price: body.price,
    format: body.format,
    turnaroundDays: body.turnaround_days,
    message: body.message,
  });
  res.status(201).json(toSnakeCase(offer));
}

export async function listMine(req: Request, res: Response) {
  const offers = await offersService.listMyOffers(req.user!.id);
  res.json(toSnakeCase(offers));
}

export async function getById(req: Request, res: Response) {
  const offer = await offersService.getOfferById(req.params.id, req.user!.id);
  res.json(toSnakeCase(offer));
}

const counterSchema = z.object({
  price: z.number().positive(),
  turnaround_days: z.number().int().positive(),
  note: z.string().max(2000).optional(),
});

export async function counter(req: Request, res: Response) {
  const body = counterSchema.parse(req.body);
  const offer = await offersService.counterOffer(req.params.id, req.user!.id, {
    price: body.price,
    turnaroundDays: body.turnaround_days,
    note: body.note,
  });
  res.json(toSnakeCase(offer));
}

export async function accept(req: Request, res: Response) {
  const deal = await offersService.acceptOffer(req.params.id, req.user!.id);
  res.status(201).json(toSnakeCase(deal));
}

export async function decline(req: Request, res: Response) {
  const offer = await offersService.declineOffer(req.params.id, req.user!.id);
  res.json(toSnakeCase(offer));
}
