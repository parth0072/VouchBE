import { Prisma } from "@prisma/client";

// Request bodies are validated field-by-field against explicit snake_case zod
// schemas (matches the doc's documented wire format exactly, and lets each field
// carry its own validation). Responses mostly just reflect Prisma models back
// out, so this generic camelCase->snake_case pass avoids hand-mapping the same
// fields again in ~40 controllers. Leaves Date alone — it already serializes
// correctly via its own toJSON().
function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toSnakeCase(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
  // decimal.js's default toString()/toJSON() strips trailing zeros regardless
  // of the DB column's declared scale — a live test caught "250" coming back
  // for a DECIMAL(10,2) column that MySQL itself stores as "250.00". Every
  // money/rating field in the API uses 2 decimal places except avg_rating
  // (DECIMAL(2,1)); decimal.js has no way to recover "declared column scale"
  // after the value's already been normalized, so this fixes at 2 for
  // everything rather than threading per-field scale through a generic,
  // field-name-unaware converter. avg_rating showing "4.90" instead of "4.9"
  // is cosmetic — same numeric value either way.
  if (value instanceof Prisma.Decimal) return value.toFixed(2);
  if (Array.isArray(value)) return value.map((item) => toSnakeCase(item));
  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[toSnakeKey(key)] = toSnakeCase(val);
    }
    return result;
  }
  return value;
}
