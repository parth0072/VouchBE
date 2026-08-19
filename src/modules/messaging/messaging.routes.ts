import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as messagingController from "./messaging.controller";

export const threadsRouter = Router();

threadsRouter.use(requireAuth);

threadsRouter.get("/", asyncHandler(messagingController.listThreads));
threadsRouter.get("/:id/messages", asyncHandler(messagingController.listMessages));
threadsRouter.post("/:id/messages", asyncHandler(messagingController.sendMessage));

// WS /ws/threads/:id (real-time delivery, §3.10/§5) isn't built in this pass —
// it's a separate infra decision (a `ws` server vs. a hosted service like
// Pusher/Ably per §5's "avoid running your own" suggestion) that needs picking
// before wiring connection auth and thread subscriptions. REST send/receive
// above is fully functional as a polling fallback in the meantime.
