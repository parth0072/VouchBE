import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";
import { transitionDeal } from "../deals/deal.state";
import { assertParticipant } from "../deals/deals.service";
import { createNotification } from "../notifications/notifications.service";

// §5: pre-signed S3 URL flow, same reasoning as portfolio items — fileUrl is
// expected to already point at S3 by the time this is called.
export async function submitDraft(dealId: string, creatorId: string, fileUrl: string, note?: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  if (deal.creatorId !== creatorId) throw new ApiError(403, "Not your deal");

  const draft = await prisma.$transaction(async (tx) => {
    const draft = await tx.draft.create({
      data: { dealId, fileUrl, note },
    });

    await transitionDeal(tx, dealId, "SUBMIT_DRAFT");

    return draft;
  });

  await createNotification(deal.clientId, "draft_submitted", { deal_id: dealId, draft_id: draft.id });

  return draft;
}

export async function listDrafts(dealId: string, userId: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new ApiError(404, "Deal not found");
  assertParticipant(deal, userId);

  return prisma.draft.findMany({ where: { dealId }, orderBy: { submittedAt: "desc" } });
}

async function getOwnedSubmittedDraft(draftId: string, clientId: string) {
  const draft = await prisma.draft.findUnique({ where: { id: draftId }, include: { deal: true } });
  if (!draft) throw new ApiError(404, "Draft not found");
  if (draft.deal.clientId !== clientId) throw new ApiError(403, "Not your deal");
  if (draft.status !== "submitted") throw new ApiError(409, "This draft was already reviewed");
  return draft;
}

export async function approveDraft(draftId: string, clientId: string) {
  const draft = await getOwnedSubmittedDraft(draftId, clientId);

  const updated = await prisma.$transaction(async (tx) => {
    const updated = await tx.draft.update({
      where: { id: draftId },
      data: { status: "approved", reviewedAt: new Date() },
    });

    await transitionDeal(tx, draft.dealId, "APPROVE_DRAFT");

    return updated;
  });

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

  const updated = await prisma.$transaction(async (tx) => {
    const updated = await tx.draft.update({
      where: { id: draftId },
      data: { status: "changes_requested", reviewedAt: new Date(), clientFeedback: feedback },
    });

    await transitionDeal(tx, draft.dealId, "REQUEST_CHANGES");

    return updated;
  });

  await createNotification(draft.deal.creatorId, "changes_requested", {
    deal_id: draft.dealId,
    draft_id: draftId,
  });

  return updated;
}
