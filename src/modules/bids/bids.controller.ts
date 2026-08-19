import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as bidsService from "./bids.service";

const createBidSchema = z.object({
  price: z.number().positive(),
  delivery_days: z.number().int().positive(),
  note: z.string().max(2000).optional(),
});

export async function create(req: Request, res: Response) {
  const body = createBidSchema.parse(req.body);
  const bid = await bidsService.createBid(req.params.id, req.user!.id, {
    price: body.price,
    deliveryDays: body.delivery_days,
    note: body.note,
  });
  res.status(201).json(toSnakeCase(bid));
}

export async function listForBrief(req: Request, res: Response) {
  const bids = await bidsService.listBidsForBrief(req.params.id, req.user!.id);
  res.json(toSnakeCase(bids));
}

export async function listMine(req: Request, res: Response) {
  const bids = await bidsService.listMyBids(req.user!.id);
  res.json(toSnakeCase(bids));
}

const updateBidSchema = z.object({
  price: z.number().positive().optional(),
  delivery_days: z.number().int().positive().optional(),
  note: z.string().max(2000).optional(),
});

export async function update(req: Request, res: Response) {
  const body = updateBidSchema.parse(req.body);
  const bid = await bidsService.updateBid(req.params.id, req.user!.id, {
    price: body.price,
    deliveryDays: body.delivery_days,
    note: body.note,
  });
  res.json(toSnakeCase(bid));
}

export async function withdraw(req: Request, res: Response) {
  await bidsService.withdrawBid(req.params.id, req.user!.id);
  res.status(204).send();
}

export async function accept(req: Request, res: Response) {
  const deal = await bidsService.acceptBid(req.params.id, req.user!.id);
  res.status(201).json(toSnakeCase(deal));
}
