import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as paymentsController from "./payments.controller";

export const transactionsRouter = Router();

transactionsRouter.get("/mine", requireAuth, asyncHandler(paymentsController.listTransactions));
