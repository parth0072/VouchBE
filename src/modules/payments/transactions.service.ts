import { prisma } from "../../lib/prisma";

export async function listMyTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
