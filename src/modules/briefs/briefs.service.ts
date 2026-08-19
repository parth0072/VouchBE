import { db } from "../../db";
import type { BriefFormat, BriefStatus } from "../../db/types";
import { newId } from "../../lib/id";
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

  const briefId = newId();
  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("briefs")
      .values({
        id: briefId,
        clientId,
        title: input.title,
        format: input.format,
        niche: input.niche,
        description: input.description,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        deadline: input.deadline,
      })
      .execute();

    if (input.referenceImages.length > 0) {
      await trx
        .insertInto("referenceImages")
        .values(input.referenceImages.map((imageUrl) => ({ id: newId(), briefId, imageUrl })))
        .execute();
    }
  });

  const referenceImages = await db.selectFrom("referenceImages").selectAll().where("briefId", "=", briefId).execute();
  const brief = await db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirstOrThrow();
  return { ...brief, referenceImages };
}

// MySQL has no Prisma-style `_count: { select: { bids: true } }` — one GROUP BY
// query batches the count for every brief in the list, merged in afterward, to
// keep the same `_count.bids` shape the API already documents.
async function attachBidCounts<T extends { id: string }>(briefs: T[]) {
  if (briefs.length === 0) return [];
  const ids = briefs.map((b) => b.id);
  const counts = await db
    .selectFrom("bids")
    .select(["briefId", (eb) => eb.fn.countAll<number>().as("count")])
    .where("briefId", "in", ids)
    .groupBy("briefId")
    .execute();
  const countByBrief = new Map(counts.map((c) => [c.briefId, Number(c.count)]));
  return briefs.map((brief) => ({ ...brief, _count: { bids: countByBrief.get(brief.id) ?? 0 } }));
}

export async function listMyBriefs(clientId: string, status?: BriefStatus) {
  const briefs = await db
    .selectFrom("briefs")
    .selectAll()
    .where("clientId", "=", clientId)
    .$if(status !== undefined, (qb) => qb.where("status", "=", status as BriefStatus))
    .orderBy("createdAt", "desc")
    .execute();
  return attachBidCounts(briefs);
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
    const profile = await db.selectFrom("creatorProfiles").select("niches").where("userId", "=", creatorId).executeTakeFirst();
    const profileNiches = (profile?.niches as string[] | null) ?? undefined;
    niches = profileNiches?.length ? profileNiches : undefined;
  }

  const briefs = await db
    .selectFrom("briefs")
    .selectAll()
    .where("status", "=", "open")
    .$if(filters.format !== undefined, (qb) => qb.where("format", "=", filters.format as BriefFormat))
    .$if(niches !== undefined, (qb) => qb.where("niche", "in", niches as string[]))
    .$if(filters.budgetMin !== undefined, (qb) => qb.where("budgetMax", ">=", String(filters.budgetMin)))
    .orderBy("createdAt", "desc")
    .execute();
  return attachBidCounts(briefs);
}

export async function getBriefById(briefId: string) {
  const brief = await db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirst();
  if (!brief) throw new ApiError(404, "Brief not found");

  const referenceImages = await db.selectFrom("referenceImages").selectAll().where("briefId", "=", briefId).execute();
  const [withCount] = await attachBidCounts([brief]);
  return { ...withCount, referenceImages };
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
  const brief = await db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirst();
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");
  if (brief.status !== "open") throw new ApiError(409, "Can only edit a brief while it's open");

  const hasUpdates = Object.values(input).some((v) => v !== undefined);
  if (hasUpdates) {
    await db
      .updateTable("briefs")
      .set({
        title: input.title,
        format: input.format,
        niche: input.niche,
        description: input.description,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        deadline: input.deadline,
      })
      .where("id", "=", briefId)
      .execute();
  }

  return db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirstOrThrow();
}

export async function cancelBrief(briefId: string, clientId: string) {
  const brief = await db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirst();
  if (!brief) throw new ApiError(404, "Brief not found");
  if (brief.clientId !== clientId) throw new ApiError(403, "Not your brief");

  const acceptedBid = await db
    .selectFrom("bids")
    .select("id")
    .where("briefId", "=", briefId)
    .where("status", "=", "accepted")
    .executeTakeFirst();
  if (acceptedBid) {
    throw new ApiError(409, "Can't cancel a brief that already has an accepted bid");
  }

  await db.updateTable("briefs").set({ status: "cancelled" }).where("id", "=", briefId).execute();
  return db.selectFrom("briefs").selectAll().where("id", "=", briefId).executeTakeFirstOrThrow();
}
