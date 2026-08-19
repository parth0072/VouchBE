import { randomUUID } from "node:crypto";

// IDs are generated in application code, not by the database (matches the
// applied schema — no DB-side default on any `id` column, same as Prisma's
// @default(uuid()) was client-side too).
export function newId(): string {
  return randomUUID();
}
