import type { Request, Response } from "express";
import { toSnakeCase } from "../../lib/caseConvert";
import * as dealsService from "./deals.service";

export async function getDeal(req: Request, res: Response) {
  const deal = await dealsService.getDealForParticipant(req.params.id, req.user!.id);
  res.json(toSnakeCase(deal));
}

export async function listMine(req: Request, res: Response) {
  const deals = await dealsService.listMyDeals(req.user!.id);
  res.json(toSnakeCase(deals));
}

export async function cancel(req: Request, res: Response) {
  const deal = await dealsService.cancelDeal(req.params.id, req.user!.id);
  res.json(toSnakeCase(deal));
}
