import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as authController from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(authController.signup));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/refresh", asyncHandler(authController.refresh));
authRouter.post("/role", requireAuth, asyncHandler(authController.switchRole));
authRouter.post("/logout", requireAuth, asyncHandler(authController.logout));
authRouter.post("/send-verification-code", requireAuth, asyncHandler(authController.sendVerificationCode));
authRouter.post("/verify-email", requireAuth, asyncHandler(authController.verifyEmail));
