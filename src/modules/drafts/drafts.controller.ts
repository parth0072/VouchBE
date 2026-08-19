import type { Request, Response } from "express";
import { z } from "zod";
import { toSnakeCase } from "../../lib/caseConvert";
import * as draftsService from "./drafts.service";

const submitDraftSchema = z.object({
  file_url: z.string().url(),
  note: z.string().max(2000).optional(),
});

export async function submit(req: Request, res: Response) {
  const body = submitDraftSchema.parse(req.body);
  const draft = await draftsService.submitDraft(req.params.id, req.user!.id, body.file_url, body.note);
  res.status(201).json(toSnakeCase(draft));
}

export async function list(req: Request, res: Response) {
  const drafts = await draftsService.listDrafts(req.params.id, req.user!.id);
  res.json(toSnakeCase(drafts));
}

export async function approve(req: Request, res: Response) {
  const draft = await draftsService.approveDraft(req.params.id, req.user!.id);
  res.json(toSnakeCase(draft));
}

const requestChangesSchema = z.object({
  feedback: z.string().min(1),
});

export async function requestChanges(req: Request, res: Response) {
  const { feedback } = requestChangesSchema.parse(req.body);
  const draft = await draftsService.requestChanges(req.params.id, req.user!.id, feedback);
  res.json(toSnakeCase(draft));
}
