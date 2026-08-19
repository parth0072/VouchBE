import Stripe from "stripe";
import { ApiError } from "./apiError";

let client: Stripe | null = null;

// Lazy + throws ApiError(501) rather than a raw Stripe SDK error, so a missing
// key surfaces the same way every other unconfigured integration in this
// codebase does (OAuth signup, social account linking) — loud and specific,
// never a fake success.
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new ApiError(501, "Stripe is not configured (missing STRIPE_SECRET_KEY)");
    }
    client = new Stripe(key);
  }
  return client;
}
