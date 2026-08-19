import { prisma } from "../../lib/prisma";

export async function registerPushToken(userId: string, platform: string, token: string) {
  return prisma.pushToken.upsert({
    where: { userId_token: { userId, token } },
    create: { userId, platform, token },
    update: { platform },
  });
}
