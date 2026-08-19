// Request bodies are validated field-by-field against explicit snake_case zod
// schemas (matches the doc's documented wire format exactly, and lets each field
// carry its own validation). Responses mostly just reflect DB rows back out, so
// this generic camelCase->snake_case pass avoids hand-mapping the same fields
// again in ~40 controllers. Leaves Date alone — it already serializes correctly
// via its own toJSON(). Decimal columns come back from mysql2 as plain, already-
// correctly-scaled strings ("450.00", not a wrapper object to unwrap), so no
// special-casing is needed for them here.
function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toSnakeCase(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
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
