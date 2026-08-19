import { env } from "./config/env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`Vouch API listening on port ${env.PORT}`);
});
