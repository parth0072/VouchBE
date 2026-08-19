import type { PayoutSchedule } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { getStripe } from "../../lib/stripe";

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

  let payoutMethod = await prisma.payoutMethod.findFirst({ where: { creatorId } });

  if (!payoutMethod) {
    const account = await stripe.accounts.create({ type: "express" });
    payoutMethod = await prisma.payoutMethod.create({
      data: { creatorId, provider: "stripe_connect", accountRef: account.id, schedule },
    });
  } else {
    payoutMethod = await prisma.payoutMethod.update({
      where: { id: payoutMethod.id },
      data: { schedule },
    });
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
  return prisma.payoutMethod.findMany({ where: { creatorId } });
}
