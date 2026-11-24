import * as SecureStore from "expo-secure-store";
import { AUTH_COOKIE_NAME } from "@/config/env";

const TOKEN_KEY = "kurban_ai_session_token";

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const clearStoredToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const extractSessionToken = (
  setCookieHeader: string | null,
): string | null => {
  if (!setCookieHeader) return null;

  const match = setCookieHeader.match(
    new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`),
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

export const buildAuthHeaders = async (
  extra: Record<string, string> = {},
): Promise<Record<string, string>> => {
  const token = await getStoredToken();
  const headers: Record<string, string> = { ...extra };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers.Cookie = `${AUTH_COOKIE_NAME}=${token}`;
  }

  return headers;
};
