import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/apiError";

// Gates the "system" (§3.8: `POST (internal/cron) /internal/escrow/release-due-payouts`)
// endpoint — this has no user, so it can't use requireAuth/JWT. Whatever
// triggers the scheduled job (cron, a scheduler service) sends this as a header;
// keep the route off any public load balancer path in real deployment too, this
// header check alone isn't a substitute for network-level isolation.
export function requireInternalSecret(req: Request, _res: Response, next: NextFunction) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    throw new ApiError(501, "INTERNAL_API_SECRET is not configured");
  }
  if (req.headers["x-internal-secret"] !== secret) {
    throw new ApiError(401, "Invalid internal secret");
  }
  next();
}
