import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra as
  | { apiUrl?: string }
  | undefined;

/** Shared Next.js backend (kurban-ai web). Override with EXPO_PUBLIC_API_URL. */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  extra?.apiUrl?.replace(/\/$/, "") ||
  "https://kurbanlikkilohesaplama.com";

export const AUTH_COOKIE_NAME = "kurban_ai_session";
export const WEB_SITE_URL = "https://kurbanlikkilohesaplama.com";
