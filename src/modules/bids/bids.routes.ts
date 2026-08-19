import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as bidsController from "./bids.controller";

export const bidsRouter = Router();

bidsRouter.use(requireAuth);

// Registered before "/:id" so "mine" isn't captured as a bid id.
bidsRouter.get("/mine", requireRole("creator"), asyncHandler(bidsController.listMine));

bidsRouter.patch("/:id", requireRole("creator"), asyncHandler(bidsController.update));
bidsRouter.delete("/:id", requireRole("creator"), asyncHandler(bidsController.withdraw));
bidsRouter.post("/:id/accept", requireRole("client"), asyncHandler(bidsController.accept));
