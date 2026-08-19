import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as dealsController from "./deals.controller";
import * as agreementController from "../agreement/agreement.controller";
import * as paymentsController from "../payments/payments.controller";
import * as draftsController from "../drafts/drafts.controller";
import * as reviewsController from "../reviews/reviews.controller";

export const dealsRouter = Router();

dealsRouter.use(requireAuth);

// Registered before "/:id" so "mine" isn't captured as a deal id.
dealsRouter.get("/mine", asyncHandler(dealsController.listMine));
dealsRouter.get("/:id", asyncHandler(dealsController.getDeal));
dealsRouter.post("/:id/cancel", asyncHandler(dealsController.cancel));

dealsRouter.post(
  "/:id/agreement",
  requireRole("client"),
  asyncHandler(agreementController.setAgreement),
);
dealsRouter.get("/:id/agreement", asyncHandler(agreementController.getAgreement));
dealsRouter.post(
  "/:id/agreement/consent",
  requireRole("creator"),
  asyncHandler(agreementController.giveConsent),
);

dealsRouter.post("/:id/fund", requireRole("client"), asyncHandler(paymentsController.fund));
dealsRouter.post("/:id/mark-live", requireRole("creator"), asyncHandler(paymentsController.markLive));

dealsRouter.post("/:id/drafts", requireRole("creator"), asyncHandler(draftsController.submit));
dealsRouter.get("/:id/drafts", asyncHandler(draftsController.list));

dealsRouter.post("/:id/review", asyncHandler(reviewsController.create));
