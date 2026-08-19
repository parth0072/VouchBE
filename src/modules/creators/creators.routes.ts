import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import * as creatorsController from "./creators.controller";

export const creatorsRouter = Router();

creatorsRouter.use(requireAuth);

// Registered before "/:id" so "search" isn't captured as a creator id.
creatorsRouter.get("/search", asyncHandler(creatorsController.search));
creatorsRouter.get("/:id", asyncHandler(creatorsController.getById));
