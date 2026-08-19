import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as draftsController from "./drafts.controller";

export const draftsRouter = Router();

draftsRouter.use(requireAuth, requireRole("client"));

draftsRouter.post("/:id/approve", asyncHandler(draftsController.approve));
draftsRouter.post("/:id/request-changes", asyncHandler(draftsController.requestChanges));
