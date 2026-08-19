import type { NextFunction, Request, Response } from "express";
import { NoResultError } from "kysely";
import { ZodError } from "zod";
import { ApiError } from "../lib/apiError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation failed", details: err.flatten() });
  }

  // executeTakeFirstOrThrow() on a missing row — Kysely's equivalent of
  // Prisma's findUniqueOrThrow/update-on-missing-row failure.
  if (err instanceof NoResultError) {
    return res.status(404).json({ error: "Not found" });
  }

  // mysql2 doesn't export a distinct error class for this — duplicate-key
  // violations surface as a plain Error with a `code` property.
  if (typeof err === "object" && err !== null && "code" in err && err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Conflicts with an existing record" });
  }

  // A write referencing a parent row that doesn't exist yet — e.g. POST
  // /briefs before POST /auth/role has created the caller's client_profiles
  // row (signup's activeRole is just a placeholder until that call lands,
  // per auth.service.ts). Surfaced live: a request made in that order 500'd
  // with a raw FK error instead of a clean, actionable response.
  if (typeof err === "object" && err !== null && "code" in err && err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "A required related record doesn't exist yet — check you've completed onboarding (e.g. POST /auth/role) first" });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
