import type { SocialAccountsTable } from "../../db/types";
import { ApiError } from "../../lib/apiError";

type SocialPlatform = SocialAccountsTable["platform"];

interface ProviderConfig {
  authUrl: string;
  scope: string;
  clientIdEnv: string;
  clientSecretEnv: string;
}

// Real endpoints/scopes per §5 (Instagram/Facebook Graph API, TikTok for
// Developers, YouTube Data API). Each needs a real app registered with that
// platform before it'll do anything — none of that exists yet, so both
// functions below fail loudly with exactly which env var is missing instead of
// returning a URL or stats that look real but aren't.
const PROVIDER_CONFIG: Record<SocialPlatform, ProviderConfig> = {
  instagram: {
    authUrl: "https://api.instagram.com/oauth/authorize",
    scope: "user_profile",
    clientIdEnv: "INSTAGRAM_CLIENT_ID",
    clientSecretEnv: "INSTAGRAM_CLIENT_SECRET",
  },
  facebook: {
    authUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    scope: "pages_show_list,instagram_basic",
    clientIdEnv: "FACEBOOK_CLIENT_ID",
    clientSecretEnv: "FACEBOOK_CLIENT_SECRET",
  },
  tiktok: {
    authUrl: "https://www.tiktok.com/v2/auth/authorize",
    scope: "user.info.basic,user.info.stats",
    clientIdEnv: "TIKTOK_CLIENT_KEY",
    clientSecretEnv: "TIKTOK_CLIENT_SECRET",
  },
  youtube: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    clientIdEnv: "YOUTUBE_CLIENT_ID",
    clientSecretEnv: "YOUTUBE_CLIENT_SECRET",
  },
};

export function buildOAuthUrl(platform: SocialPlatform): string {
  const config = PROVIDER_CONFIG[platform];
  const clientId = process.env[config.clientIdEnv];
  if (!clientId) {
    throw new ApiError(501, `${platform} OAuth is not configured (missing ${config.clientIdEnv})`);
  }

  const redirectBase = process.env.OAUTH_REDIRECT_BASE_URL;
  if (!redirectBase) {
    throw new ApiError(501, "OAUTH_REDIRECT_BASE_URL is not configured");
  }

  const url = new URL(config.authUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${redirectBase}/${platform}`);
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

export interface FetchedSocialStats {
  handle: string;
  followerCount: number;
  engagementRate: number | null;
  oauthTokenRef: string;
}

// Real implementation: POST `code` to the provider's token endpoint, store the
// returned access/refresh token in a secrets manager (per §2.1's note — never
// the raw token in this DB), then call the provider's profile/insights endpoint
// for handle/follower_count/engagement_rate.
export async function exchangeCodeForStats(
  platform: SocialPlatform,
  _code: string,
): Promise<FetchedSocialStats> {
  const config = PROVIDER_CONFIG[platform];
  const clientId = process.env[config.clientIdEnv];
  const clientSecret = process.env[config.clientSecretEnv];
  if (!clientId || !clientSecret) {
    throw new ApiError(501, `${platform} OAuth is not configured`);
  }
  throw new ApiError(
    501,
    `${platform} token exchange is not implemented — needs that provider's real token + stats API wired up`,
  );
}
