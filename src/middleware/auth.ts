import type { NextFunction, Request, Response } from "express";
import { db } from "../db";
import type { UsersTable } from "../db/types";
import { verifyAccessToken } from "../lib/jwt";
import { ApiError } from "../lib/apiError";
import { asyncHandler } from "../lib/asyncHandler";

type Role = UsersTable["activeRole"];

export interface AuthenticatedUser {
  id: string;
  activeRole: Role;
  hasClientProfile: boolean;
  hasCreatorProfile: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing bearer token");
  }

  const token = header.slice("Bearer ".length);

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await db
    .selectFrom("users")
    .select(["id", "activeRole", "hasClientProfile", "hasCreatorProfile"])
    .where("id", "=", payload.sub)
    .executeTakeFirst();

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});

// Scopes a route to whichever role is currently active on the account (§1: one
// account, switchable role) — matches the Auth column ("client" / "creator") in
// Backend Requirements.md §3.
export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.activeRole !== role) {
      throw new ApiError(403, `Requires active role: ${role}`);
    }
    next();
  };
}
