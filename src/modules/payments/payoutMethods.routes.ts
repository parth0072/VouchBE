import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as paymentsController from "./payments.controller";

export const payoutMethodsRouter = Router();

payoutMethodsRouter.use(requireAuth, requireRole("creator"));

payoutMethodsRouter.post("/", asyncHandler(paymentsController.createPayoutMethod));
payoutMethodsRouter.get("/", asyncHandler(paymentsController.listPayoutMethods));
