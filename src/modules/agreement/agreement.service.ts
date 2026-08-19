import { db } from "../../db";
import type { AgreementsTable } from "../../db/types";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { transitionDeal } from "../deals/deal.state";
import { assertParticipant } from "../deals/deals.service";

type UsageRights = AgreementsTable["usageRights"];

export interface SetAgreementInput {
  usageRights: UsageRights;
  liveDurationDays: number;
  approvalRequired: boolean;
  minViews?: number | null;
}

// §4 rule 1: consent is a hard gate. Setting terms only ever moves the deal
// negotiating -> agreement_pending; escrow_funded still requires
// creator_consented_at, enforced again in the fund endpoint (§3.8).
export async function setAgreement(dealId: string, clientId: string, input: SetAgreementInput) {
  const deal = await db.selectFrom("deals").select(["id", "clientId"]).where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.clientId !== clientId) throw new ApiError(403, "Not your deal");

  const id = newId();
  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("agreements")
      .values({
        id,
        dealId,
        usageRights: input.usageRights,
        liveDurationDays: input.liveDurationDays,
        approvalRequired: input.approvalRequired,
        minViews: input.minViews ?? null,
        clientConsentedAt: new Date(),
      })
      .execute();

    await transitionDeal(trx, dealId, "SET_AGREEMENT");
  });

  return db.selectFrom("agreements").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function getAgreement(dealId: string, userId: string) {
  const deal = await db.selectFrom("deals").select(["clientId", "creatorId"]).where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);

  const agreement = await db.selectFrom("agreements").selectAll().where("dealId", "=", dealId).executeTakeFirst();
  if (!agreement) throw new ApiError(404, "No agreement set on this deal yet");
  return agreement;
}

// This is the literal enforcement point for screen 15's checkbox — `consented`
// must be exactly `true`, and terms must already exist, or this rejects with 400
// (not 403/409) per §3.7's own wording.
export async function giveConsent(dealId: string, creatorId: string, consented: unknown) {
  const deal = await db.selectFrom("deals").select(["creatorId"]).where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.creatorId !== creatorId) throw new ApiError(403, "Not your deal");

  if (consented !== true) {
    throw new ApiError(400, "consented must be true");
  }

  const agreement = await db.selectFrom("agreements").selectAll().where("dealId", "=", dealId).executeTakeFirst();
  if (!agreement || agreement.clientConsentedAt === null) {
    throw new ApiError(400, "Client has not set terms yet");
  }

  await db.updateTable("agreements").set({ creatorConsentedAt: new Date() }).where("dealId", "=", dealId).execute();
  return db.selectFrom("agreements").selectAll().where("dealId", "=", dealId).executeTakeFirstOrThrow();
}
