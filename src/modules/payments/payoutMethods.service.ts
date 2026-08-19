import { db } from "../../db";
import type { PayoutMethodsTable } from "../../db/types";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { getStripe } from "../../lib/stripe";

type PayoutSchedule = PayoutMethodsTable["schedule"];

// "provider-specific onboarding" (§3.8) — for stripe_connect that's an Express
// account plus a hosted onboarding link; the creator finishes setup on Stripe's
// page, not ours. Reuses an existing Connect account if the creator already
// started onboarding rather than creating a duplicate one.
export async function createPayoutMethod(creatorId: string, schedule: PayoutSchedule) {
  const returnUrl = process.env.STRIPE_CONNECT_RETURN_URL;
  const refreshUrl = process.env.STRIPE_CONNECT_REFRESH_URL;
  if (!returnUrl || !refreshUrl) {
    throw new ApiError(
      501,
      "Stripe Connect onboarding is not configured (missing STRIPE_CONNECT_RETURN_URL/REFRESH_URL)",
    );
  }

  const stripe = getStripe();

  let payoutMethod = await db.selectFrom("payoutMethods").selectAll().where("creatorId", "=", creatorId).executeTakeFirst();

  if (!payoutMethod) {
    const account = await stripe.accounts.create({ type: "express" });
    const id = newId();
    await db
      .insertInto("payoutMethods")
      .values({ id, creatorId, provider: "stripe_connect", accountRef: account.id, schedule })
      .execute();
    payoutMethod = await db.selectFrom("payoutMethods").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
  } else {
    await db.updateTable("payoutMethods").set({ schedule }).where("id", "=", payoutMethod.id).execute();
    payoutMethod = await db.selectFrom("payoutMethods").selectAll().where("id", "=", payoutMethod.id).executeTakeFirstOrThrow();
  }

  const accountLink = await stripe.accountLinks.create({
    account: payoutMethod.accountRef,
    type: "account_onboarding",
    return_url: returnUrl,
    refresh_url: refreshUrl,
  });

  return { payoutMethod, onboardingUrl: accountLink.url };
}

export async function listPayoutMethods(creatorId: string) {
  return db.selectFrom("payoutMethods").selectAll().where("creatorId", "=", creatorId).execute();
}
