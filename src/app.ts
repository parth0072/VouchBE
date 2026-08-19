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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/deals", dealsRouter);
app.use("/social-accounts", socialAccountsRouter);
app.use("/creator-profile", creatorProfileRouter);
app.use("/briefs", briefsRouter);
app.use("/bids", bidsRouter);
app.use("/creators", creatorsRouter);
app.use("/offers", offersRouter);
app.use("/payment-methods", paymentMethodsRouter);
app.use("/payout-methods", payoutMethodsRouter);
app.use("/transactions", transactionsRouter);
app.use("/internal", internalRouter);
app.use("/drafts", draftsRouter);
app.use("/threads", threadsRouter);
app.use("/notifications", notificationsRouter);
app.use("/push-tokens", pushTokensRouter);
app.use("/users", usersRouter);
app.use("/me", meRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);
