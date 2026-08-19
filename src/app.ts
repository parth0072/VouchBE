import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { dealsRouter } from "./modules/deals/deals.routes";
import { socialAccountsRouter } from "./modules/onboarding/socialAccounts.routes";
import { creatorProfileRouter } from "./modules/onboarding/creatorProfile.routes";
import { briefsRouter } from "./modules/briefs/briefs.routes";
import { bidsRouter } from "./modules/bids/bids.routes";
import { creatorsRouter } from "./modules/creators/creators.routes";
import { offersRouter } from "./modules/offers/offers.routes";
import { paymentMethodsRouter } from "./modules/payments/paymentMethods.routes";
import { payoutMethodsRouter } from "./modules/payments/payoutMethods.routes";
import { transactionsRouter } from "./modules/payments/transactions.routes";
import { internalRouter } from "./modules/payments/internal.routes";
import { draftsRouter } from "./modules/drafts/drafts.routes";
import { threadsRouter } from "./modules/messaging/messaging.routes";
import { notificationsRouter, pushTokensRouter } from "./modules/notifications/notifications.routes";
import { usersRouter } from "./modules/reviews/users.routes";
import { meRouter } from "./modules/settings/settings.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Everything lives on this router, then gets mounted under BASE_PATH — e.g.
// cPanel's Setup Node.js App wizard put this deployment at a sub-URI
// (alphabyteinnovation.com/vouch) without Passenger stripping the prefix
// before forwarding, so the app has to know its own base path rather than
// assuming it's always served from "/". Unset/empty BASE_PATH (the default —
// true for local dev and most other hosts) mounts at the root exactly as
// before.
const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/deals", dealsRouter);
apiRouter.use("/social-accounts", socialAccountsRouter);
apiRouter.use("/creator-profile", creatorProfileRouter);
apiRouter.use("/briefs", briefsRouter);
apiRouter.use("/bids", bidsRouter);
apiRouter.use("/creators", creatorsRouter);
apiRouter.use("/offers", offersRouter);
apiRouter.use("/payment-methods", paymentMethodsRouter);
apiRouter.use("/payout-methods", payoutMethodsRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/internal", internalRouter);
apiRouter.use("/drafts", draftsRouter);
apiRouter.use("/threads", threadsRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/push-tokens", pushTokensRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/me", meRouter);

apiRouter.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const basePath = process.env.BASE_PATH?.trim();
if (basePath) {
  app.use(basePath, apiRouter);
} else {
  app.use(apiRouter);
}

app.use(errorHandler);
