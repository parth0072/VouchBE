import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireInternalSecret } from "../../middleware/internalAuth";
import * as paymentsController from "./payments.controller";

export const internalRouter = Router();

internalRouter.post(
  "/escrow/release-due-payouts",
  requireInternalSecret,
  asyncHandler(paymentsController.releaseDuePayouts),
);
