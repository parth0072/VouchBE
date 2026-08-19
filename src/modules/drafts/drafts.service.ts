import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { transitionDeal } from "../deals/deal.state";
import { assertParticipant } from "../deals/deals.service";
import { createNotification } from "../notifications/notifications.service";

// §5: pre-signed S3 URL flow, same reasoning as portfolio items — fileUrl is
// expected to already point at S3 by the time this is called.
export async function submitDraft(dealId: string, creatorId: string, fileUrl: string, note?: string) {
  const deal = await db.selectFrom("deals").select(["clientId", "creatorId"]).where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.creatorId !== creatorId) throw new ApiError(403, "Not your deal");

  const id = newId();
  await db.transaction().execute(async (trx) => {
    await trx.insertInto("drafts").values({ id, dealId, fileUrl, note }).execute();
    await transitionDeal(trx, dealId, "SUBMIT_DRAFT");
  });
  const draft = await db.selectFrom("drafts").selectAll().where("id", "=", id).executeTakeFirstOrThrow();

  await createNotification(deal.clientId, "draft_submitted", { deal_id: dealId, draft_id: draft.id });

  return draft;
}

export async function listDrafts(dealId: string, userId: string) {
  const deal = await db.selectFrom("deals").select(["clientId", "creatorId"]).where("id", "=", dealId).executeTakeFirst();
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);

  return db.selectFrom("drafts").selectAll().where("dealId", "=", dealId).orderBy("submittedAt", "desc").execute();
}

async function getOwnedSubmittedDraft(draftId: string, clientId: string) {
  const draft = await db.selectFrom("drafts").selectAll().where("id", "=", draftId).executeTakeFirst();
  if (!draft) throw new ApiError(404, "Draft not found");
  const deal = await db.selectFrom("deals").select(["clientId", "creatorId"]).where("id", "=", draft.dealId).executeTakeFirstOrThrow();
  if (deal.clientId !== clientId) throw new ApiError(403, "Not your deal");
  if (draft.status !== "submitted") throw new ApiError(409, "This draft was already reviewed");
  return { ...draft, deal };
}

export async function approveDraft(draftId: string, clientId: string) {
  const draft = await getOwnedSubmittedDraft(draftId, clientId);

  await db.transaction().execute(async (trx) => {
    await trx.updateTable("drafts").set({ status: "approved", reviewedAt: new Date() }).where("id", "=", draftId).execute();
    await transitionDeal(trx, draft.dealId, "APPROVE_DRAFT");
  });
  const updated = await db.selectFrom("drafts").selectAll().where("id", "=", draftId).executeTakeFirstOrThrow();

  await createNotification(draft.deal.creatorId, "draft_approved", {
    deal_id: draft.dealId,
    draft_id: draftId,
  });

  return updated;
}

// §4 rule 5: "Request changes" only ever touches Draft + Deal.status — this
// function has no access to (and never calls) the agreement module.
export async function requestChanges(draftId: string, clientId: string, feedback: string) {
  const draft = await getOwnedSubmittedDraft(draftId, clientId);

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable("drafts")
      .set({ status: "changes_requested", reviewedAt: new Date(), clientFeedback: feedback })
      .where("id", "=", draftId)
      .execute();
    await transitionDeal(trx, draft.dealId, "REQUEST_CHANGES");
  });
  const updated = await db.selectFrom("drafts").selectAll().where("id", "=", draftId).executeTakeFirstOrThrow();

  await createNotification(draft.deal.creatorId, "changes_requested", {
    deal_id: draft.dealId,
    draft_id: draftId,
  });

  return updated;
}
