import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as onboardingController from "./onboarding.controller";

export const socialAccountsRouter = Router();

socialAccountsRouter.use(requireAuth);

socialAccountsRouter.get("/:platform/oauth-url", asyncHandler(onboardingController.getOAuthUrl));
socialAccountsRouter.post("/:platform/callback", asyncHandler(onboardingController.handleCallback));
socialAccountsRouter.delete("/:id", asyncHandler(onboardingController.deleteSocialAccount));
