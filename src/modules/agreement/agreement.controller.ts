import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as agreementService from "./agreement.service";

const USAGE_RIGHTS = ["organic", "paid_ads", "whitelisting"] as const;

const setAgreementSchema = z.object({
  usage_rights: z.enum(USAGE_RIGHTS),
  live_duration_days: z.number().int().positive(),
  approval_required: z.boolean(),
  // nullable(), not just optional(): Agreement.min_views is a nullable DB column
  // (§2.3, "optional performance guarantee"), and a client explicitly clearing it
  // sends `null`, not just omitting the key — a live test caught zod rejecting
  // `{ min_views: null }` with a 400 before this was added.
  min_views: z.number().int().positive().nullable().optional(),
});

export async function setAgreement(req: Request, res: Response) {
  const body = setAgreementSchema.parse(req.body);
  const agreement = await agreementService.setAgreement(req.params.id, req.user!.id, {
    usageRights: body.usage_rights,
    liveDurationDays: body.live_duration_days,
    approvalRequired: body.approval_required,
    minViews: body.min_views,
  });
  res.status(201).json(toSnakeCase(agreement));
}

export async function getAgreement(req: Request, res: Response) {
  const agreement = await agreementService.getAgreement(req.params.id, req.user!.id);
  res.json(toSnakeCase(agreement));
}

// `consented` is intentionally left unvalidated by zod (z.unknown()) — the
// service checks `=== true` itself so a truthy-but-not-boolean value like "true"
// or 1 is rejected too, matching §3.7's "not literally true" wording exactly.
const consentSchema = z.object({ consented: z.unknown() });

export async function giveConsent(req: Request, res: Response) {
  const body = consentSchema.parse(req.body);
  const agreement = await agreementService.giveConsent(req.params.id, req.user!.id, body.consented);
  res.json(toSnakeCase(agreement));
}
