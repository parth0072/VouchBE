import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as offersController from "./offers.controller";

export const offersRouter = Router();

offersRouter.use(requireAuth);

offersRouter.post("/", requireRole("client"), asyncHandler(offersController.create));

// Registered before "/:id" so "mine" isn't captured as an offer id.
offersRouter.get("/mine", asyncHandler(offersController.listMine));

offersRouter.get("/:id", asyncHandler(offersController.getById));
offersRouter.post("/:id/counter", asyncHandler(offersController.counter));
offersRouter.post("/:id/accept", asyncHandler(offersController.accept));
offersRouter.post("/:id/decline", asyncHandler(offersController.decline));
