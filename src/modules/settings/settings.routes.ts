import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as settingsController from "./settings.controller";

export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get("/", asyncHandler(settingsController.getMe));
meRouter.patch("/", asyncHandler(settingsController.updateMe));
