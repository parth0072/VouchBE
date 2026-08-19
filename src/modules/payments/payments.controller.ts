import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as escrowService from "./escrow.service";
import * as paymentMethodsService from "./paymentMethods.service";
import * as payoutMethodsService from "./payoutMethods.service";
import * as transactionsService from "./transactions.service";

const fundSchema = z.object({ payment_method_id: z.string().uuid() });

export async function fund(req: Request, res: Response) {
  const { payment_method_id } = fundSchema.parse(req.body);
  const escrow = await escrowService.fundEscrow(req.params.id, req.user!.id, payment_method_id);
  res.json(toSnakeCase(escrow));
}

const markLiveSchema = z.object({ live_url: z.string().url().optional() });

export async function markLive(req: Request, res: Response) {
  const { live_url } = markLiveSchema.parse(req.body);
  const escrow = await escrowService.markLive(req.params.id, req.user!.id, live_url);
  res.json(toSnakeCase(escrow));
}

export async function releaseDuePayouts(_req: Request, res: Response) {
  const summary = await escrowService.releaseDuePayouts();
  res.json(toSnakeCase(summary));
}

export async function listTransactions(req: Request, res: Response) {
  const transactions = await transactionsService.listMyTransactions(req.user!.id);
  res.json(toSnakeCase(transactions));
}

const addPaymentMethodSchema = z.object({ payment_method_id: z.string() });

export async function addPaymentMethod(req: Request, res: Response) {
  const { payment_method_id } = addPaymentMethodSchema.parse(req.body);
  const method = await paymentMethodsService.addPaymentMethod(req.user!.id, payment_method_id);
  res.status(201).json(toSnakeCase(method));
}

export async function listPaymentMethods(req: Request, res: Response) {
  const methods = await paymentMethodsService.listPaymentMethods(req.user!.id);
  res.json(toSnakeCase(methods));
}

const createPayoutMethodSchema = z.object({
  schedule: z.enum(["weekly", "biweekly"]).default("weekly"),
});

export async function createPayoutMethod(req: Request, res: Response) {
  const { schedule } = createPayoutMethodSchema.parse(req.body);
  const result = await payoutMethodsService.createPayoutMethod(req.user!.id, schedule);
  res.status(201).json(toSnakeCase(result));
}

export async function listPayoutMethods(req: Request, res: Response) {
  const methods = await payoutMethodsService.listPayoutMethods(req.user!.id);
  res.json(toSnakeCase(methods));
}
