import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { verifyAccessToken } from "../lib/jwt";
import { ApiError } from "../lib/apiError";
import { asyncHandler } from "../lib/asyncHandler";

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

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, activeRole: true, hasClientProfile: true, hasCreatorProfile: true },
  });

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
