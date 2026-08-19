import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as briefsController from "./briefs.controller";
import * as bidsController from "../bids/bids.controller";

export const briefsRouter = Router();

briefsRouter.use(requireAuth);

briefsRouter.post("/", requireRole("client"), asyncHandler(briefsController.createBrief));

// Registered before "/:id" so "mine"/"feed" aren't captured as a brief id.
briefsRouter.get("/mine", requireRole("client"), asyncHandler(briefsController.listMine));
briefsRouter.get("/feed", requireRole("creator"), asyncHandler(briefsController.getFeed));

briefsRouter.get("/:id", asyncHandler(briefsController.getById));
briefsRouter.patch("/:id", requireRole("client"), asyncHandler(briefsController.update));
briefsRouter.post("/:id/cancel", requireRole("client"), asyncHandler(briefsController.cancel));

// §3.4 nests bid creation/listing under the brief's own path.
briefsRouter.post("/:id/bids", requireRole("creator"), asyncHandler(bidsController.create));
briefsRouter.get("/:id/bids", requireRole("client"), asyncHandler(bidsController.listForBrief));
