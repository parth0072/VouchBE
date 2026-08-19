import type { BriefFormat, BriefStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/apiError";

export interface CreateBriefInput {
  title: string;
  format: BriefFormat;
  niche: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
  referenceImages: string[];
}

export async function createBrief(clientId: string, input: CreateBriefInput) {
  if (input.budgetMax < input.budgetMin) {
    throw new ApiError(400, "budget_max must be >= budget_min");
  }

  return prisma.brief.create({
    data: {
      clientId,
      title: input.title,
      format: input.format,
      niche: input.niche,
      description: input.description,
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      deadline: input.deadline,
      referenceImages: { create: input.referenceImages.map((imageUrl) => ({ imageUrl })) },
    },
    include: { referenceImages: true },
  });
}

export async function listMyBriefs(clientId: string, status?: BriefStatus) {
  return prisma.brief.findMany({
    where: { clientId, status },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export interface BriefFeedFilters {
  niche?: string;
  budgetMin?: number;
  format?: BriefFormat;
}

// "pre-filtered by creator's own niches by default" (§3.3) — explicit `niche`
// wins; otherwise fall back to the creator's own CreatorProfile.niches.
export async function getBriefFeed(creatorId: string, filters: BriefFeedFilters) {
  let niches: string[] | undefined = filters.niche ? [filters.niche] : undefined;

  if (!niches) {
    const profile = await prisma.creatorProfile.findUnique({ where: { userId: creatorId } });
    const profileNiches = (profile?.niches as string[] | null) ?? undefined;
    niches = profileNiches?.length ? profileNiches : undefined;
  }

  return prisma.brief.findMany({
    where: {
      status: "open",
      format: filters.format,
      niche: niches ? { in: niches } : undefined,
      budgetMax: filters.budgetMin ? { gte: filters.budgetMin } : undefined,
    },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBriefById(briefId: string) {
  const brief = await prisma.brief.findUnique({
    where: { id: briefId },
    include: { referenceImages: true, _count: { select: { bids: true } } },
  });
  if (!brief) throw new ApiError(404, "Brief not found");
  return brief;
}

export interface UpdateBriefInput {
  title?: string;
  format?: BriefFormat;
  niche?: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  deadline?: Date;
}

export async function updateBrief(briefId: string, clientId: string, input: UpdateBriefInput) {
  const brief = await prisma.brief.findUnique({ where: { id: briefId } });
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");
  if (brief.status !== "open") throw new ApiError(409, "Can only edit a brief while it's open");

  return prisma.brief.update({
    where: { id: briefId },
    data: {
      title: input.title,
      format: input.format,
      niche: input.niche,
      description: input.description,
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      deadline: input.deadline,
    },
  });
}

export async function cancelBrief(briefId: string, clientId: string) {
  const brief = await prisma.brief.findUnique({ where: { id: briefId } });
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");

  const acceptedBid = await prisma.bid.findFirst({ where: { briefId, status: "accepted" } });
  if (acceptedBid) {
    throw new ApiError(409, "Can't cancel a brief that already has an accepted bid");
  }

  return prisma.brief.update({ where: { id: briefId }, data: { status: "cancelled" } });
}
