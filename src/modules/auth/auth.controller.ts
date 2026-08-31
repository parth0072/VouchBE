import type { Request, Response } from "express";
import { z } from "zod";
import * as authService from "./auth.service";

const passwordSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // Optional: existing callers (validate scripts, the API console, earlier
  // prototype wiring) don't send this, and shouldn't start 400ing because a
  // newer client added a name step ahead of them.
  name: z.string().min(1).optional(),
});

const oauthSignupSchema = z.object({
  oauth_provider: z.string(),
  oauth_token: z.string(),
});

const signupSchema = z.union([passwordSignupSchema, oauthSignupSchema]);

export async function signup(req: Request, res: Response) {
  const body = signupSchema.parse(req.body);

  const tokens =
    "oauth_provider" in body
      ? await authService.signupWithOAuth(body.oauth_provider, body.oauth_token)
      : await authService.signupWithPassword(body.email, body.password, body.name);

  res.status(201).json(tokens);
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const tokens = await authService.login(email, password);
  res.json(tokens);
}

const refreshSchema = z.object({
  refresh_token: z.string(),
});

export async function refresh(req: Request, res: Response) {
  const { refresh_token } = refreshSchema.parse(req.body);
  const tokens = await authService.refresh(refresh_token);
  res.json(tokens);
}

const roleSchema = z.object({
  role: z.enum(["client", "creator"]),
});

export async function switchRole(req: Request, res: Response) {
  const { role } = roleSchema.parse(req.body);
  const user = await authService.switchRole(req.user!.id, role);
  res.json({
    id: user.id,
    email: user.email,
    active_role: user.activeRole,
    has_client_profile: user.hasClientProfile,
    has_creator_profile: user.hasCreatorProfile,
  });
}

// Tokens here are stateless JWTs — §2 has no refresh-token/session table to
// revoke a row in, so there's nothing to invalidate server-side with the
// current data model. This just gives the client a clean 200 to discard its
// tokens against; add a token-blacklist table if server-side revocation
// becomes a real requirement.
export async function logout(_req: Request, res: Response) {
  res.status(200).json({ ok: true });
}

export async function sendVerificationCode(req: Request, res: Response) {
  await authService.sendVerificationCode(req.user!.id);
  res.status(200).json({ sent: true });
}

const verifyEmailSchema = z.object({
  code: z.string().length(6),
});

export async function verifyEmail(req: Request, res: Response) {
  const { code } = verifyEmailSchema.parse(req.body);
  await authService.verifyEmail(req.user!.id, code);
  res.status(200).json({ verified: true });
}
