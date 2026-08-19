import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { getStripe } from "../../lib/stripe";

// Client confirms a SetupIntent with Stripe.js/the mobile SDK first (never our
// server — that's the point of SetupIntents, card data never touches this API);
// we just take the resulting PaymentMethod id and read its card details back
// from Stripe to store brand/last4. provider_token stays the only place a card
// is referenced — never raw card data, per §2.6.
export async function addPaymentMethod(clientId: string, stripePaymentMethodId: string) {
  const stripe = getStripe();
  const pm = await stripe.paymentMethods.retrieve(stripePaymentMethodId);

  if (!pm.card) {
    throw new ApiError(400, "That payment method isn't a card");
  }

  const { count } = await db
    .selectFrom("paymentMethods")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .where("clientId", "=", clientId)
    .executeTakeFirstOrThrow();

  const id = newId();
  await db
    .insertInto("paymentMethods")
    .values({
      id,
      clientId,
      providerToken: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      isDefault: Number(count) === 0,
    })
    .execute();

  return db.selectFrom("paymentMethods").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function listPaymentMethods(clientId: string) {
  return db.selectFrom("paymentMethods").selectAll().where("clientId", "=", clientId).orderBy("isDefault", "desc").execute();
}
