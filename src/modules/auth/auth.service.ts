import bcrypt from "bcryptjs";
import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt";

type Role = "client" | "creator";

const BCRYPT_ROUNDS = 12;

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

function issueTokens(userId: string): TokenPair {
  return {
    access_token: signAccessToken(userId),
    refresh_token: signRefreshToken(userId),
  };
}

export async function signupWithPassword(email: string, password: string) {
  const existing = await db.selectFrom("users").select("id").where("email", "=", email).executeTakeFirst();
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const now = new Date();

  // §2.1 doesn't say what active_role starts as — role select (screen 01) is the
  // very next step client-side, immediately after signup, via POST /auth/role.
  // `client` here is just a non-null placeholder until that call lands.
  const userId = newId();
  await db
    .insertInto("users")
    .values({ id: userId, email, passwordHash, activeRole: "client", updatedAt: now })
    .execute();

  return issueTokens(userId);
}

// The doc's `{oauth_provider, oauth_token}` signup path requires verifying the
// token against the provider (Google/Apple/etc) to get a real email + provider
// user id — trusting a client-supplied token without that check would let anyone
// mint an account for any email. Not wiring that up without real provider
// credentials, so this fails loudly instead of pretending to work.
export async function signupWithOAuth(_provider: string, _token: string): Promise<never> {
  throw new ApiError(501, "OAuth signup is not configured yet");
}

export async function login(email: string, password: string) {
  const user = await db.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
  if (!user || !user.passwordHash) {
    throw new ApiError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return issueTokens(user.id);
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await db.selectFrom("users").select("id").where("id", "=", payload.sub).executeTakeFirst();
  if (!user) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  return issueTokens(user.id);
}

// "creates the missing profile row on first switch" (§3.1). Profile fields that
// onboarding hasn't collected yet stay null — see the nullability note on
// ClientProfile/CreatorProfile in db/types.ts.
export async function switchRole(userId: string, role: Role) {
  return db.transaction().execute(async (trx) => {
    const user = await trx.selectFrom("users").selectAll().where("id", "=", userId).executeTakeFirstOrThrow();

    if (role === "client" && !user.hasClientProfile) {
      await trx.insertInto("clientProfiles").values({ userId }).execute();
    }
    if (role === "creator" && !user.hasCreatorProfile) {
      await trx.insertInto("creatorProfiles").values({ userId }).execute();
    }

    await trx
      .updateTable("users")
      .set({
        activeRole: role,
        hasClientProfile: role === "client" ? true : user.hasClientProfile,
        hasCreatorProfile: role === "creator" ? true : user.hasCreatorProfile,
        updatedAt: new Date(),
      })
      .where("id", "=", userId)
      .execute();

    return trx
      .selectFrom("users")
      .select(["id", "email", "activeRole", "hasClientProfile", "hasCreatorProfile"])
      .where("id", "=", userId)
      .executeTakeFirstOrThrow();
  });
}
