import bcrypt from "bcryptjs";
import { db } from "../../db";
import { newId } from "../../lib/id";
import { ApiError } from "../../lib/apiError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt";
import { sendVerificationCodeEmail } from "../../lib/email";

type Role = "client" | "creator";

const BCRYPT_ROUNDS = 12;
const VERIFICATION_CODE_TTL_MINUTES = 10;

function generateVerificationCode(): string {
  // 6 digits, zero-padded — Math.random() is fine here: this is a UX
  // convenience code with a short TTL and a single active value per user
  // (see users.verification_code), not a cryptographic secret.
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

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

export async function signupWithPassword(email: string, password: string, name?: string) {
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
    .values({ id: userId, email, passwordHash, name: name ?? null, activeRole: "client", updatedAt: now })
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
// ClientProfile/CreatorProfile in db/types.ts. avatarUrl is the one exception:
// backfilled from users.avatarUrl if already set, since the prototype's photo
// step runs before role-select — a live test caught this leaving the new
// profile row's avatar_url null even though the user had already set one
// (creator search/bids/etc. read avatar_url from the profile row, not users).
export async function switchRole(userId: string, role: Role) {
  return db.transaction().execute(async (trx) => {
    const user = await trx.selectFrom("users").selectAll().where("id", "=", userId).executeTakeFirstOrThrow();

    if (role === "client" && !user.hasClientProfile) {
      await trx.insertInto("clientProfiles").values({ userId, avatarUrl: user.avatarUrl }).execute();
    }
    if (role === "creator" && !user.hasCreatorProfile) {
      await trx.insertInto("creatorProfiles").values({ userId, avatarUrl: user.avatarUrl }).execute();
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

// Real code generation/storage/expiry either way; sending the email is the
// part gated on SMTP config (lib/email.ts throws ApiError(501) itself if
// unconfigured — that propagates out of here unchanged, same as every other
// gated integration in this codebase). Deliberately doesn't fake success by
// marking a code "sent" when no email actually went out.
export async function sendVerificationCode(userId: string) {
  const user = await db.selectFrom("users").select(["email", "emailVerifiedAt"]).where("id", "=", userId).executeTakeFirstOrThrow();
  if (user.emailVerifiedAt) {
    throw new ApiError(400, "Email is already verified");
  }

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000);

  await db
    .updateTable("users")
    .set({ verificationCode: code, verificationCodeExpiresAt: expiresAt, updatedAt: new Date() })
    .where("id", "=", userId)
    .execute();

  await sendVerificationCodeEmail(user.email, code, VERIFICATION_CODE_TTL_MINUTES);
}

export async function verifyEmail(userId: string, code: string) {
  const user = await db
    .selectFrom("users")
    .select(["verificationCode", "verificationCodeExpiresAt", "emailVerifiedAt"])
    .where("id", "=", userId)
    .executeTakeFirstOrThrow();

  if (user.emailVerifiedAt) {
    throw new ApiError(400, "Email is already verified");
  }
  if (!user.verificationCode || !user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired code");
  }
  if (user.verificationCode !== code) {
    throw new ApiError(400, "Invalid or expired code");
  }

  await db
    .updateTable("users")
    .set({ emailVerifiedAt: new Date(), verificationCode: null, verificationCodeExpiresAt: null, updatedAt: new Date() })
    .where("id", "=", userId)
    .execute();
}
