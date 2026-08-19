import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as onboardingController from "./onboarding.controller";

export const creatorProfileRouter = Router();

creatorProfileRouter.use(requireAuth);

creatorProfileRouter.patch("/", asyncHandler(onboardingController.updateCreatorProfile));
creatorProfileRouter.post("/portfolio", asyncHandler(onboardingController.addPortfolioItem));
creatorProfileRouter.delete("/portfolio/:id", asyncHandler(onboardingController.deletePortfolioItem));
