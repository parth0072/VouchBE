import { db } from "../../db";

export async function listMyTransactions(userId: string) {
  return db.selectFrom("transactions").selectAll().where("userId", "=", userId).orderBy("createdAt", "desc").execute();
}
