import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/auth";
import * as paymentsController from "./payments.controller";

export const paymentMethodsRouter = Router();

paymentMethodsRouter.use(requireAuth, requireRole("client"));

paymentMethodsRouter.post("/", asyncHandler(paymentsController.addPaymentMethod));
paymentMethodsRouter.get("/", asyncHandler(paymentsController.listPaymentMethods));
