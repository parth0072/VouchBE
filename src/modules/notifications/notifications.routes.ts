import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as notificationsController from "./notifications.controller";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", asyncHandler(notificationsController.list));
notificationsRouter.post("/:id/read", asyncHandler(notificationsController.markRead));

export const pushTokensRouter = Router();
pushTokensRouter.post("/", requireAuth, asyncHandler(notificationsController.registerPushToken));
