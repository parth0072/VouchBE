import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as reviewsController from "./reviews.controller";

export const usersRouter = Router();

usersRouter.get("/:id/reviews", requireAuth, asyncHandler(reviewsController.listForUser));
