import { apiRequest } from "@/api/client";
import { clearStoredToken } from "@/api/session";
import type { SafeUser } from "@/types";

type AuthResponse = {
  success: boolean;
  message?: string;
  error?: string;
  user?: SafeUser;
  token?: string;
};

export type RegisterPayload = {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  usagePurpose?: string;
};

export const loginRequest = async (email: string, password: string) => {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });

  if (data.token) {
    const { setStoredToken } = await import("@/api/session");
    await setStoredToken(data.token);
  }

  return data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const data = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });

  if (data.token) {
    const { setStoredToken } = await import("@/api/session");
    await setStoredToken(data.token);
  }

  return data;
};

export const meRequest = async () =>
  apiRequest<{ success: boolean; user: SafeUser }>("/api/auth/me");

export const logoutRequest = async () => {
  try {
    await apiRequest<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    await clearStoredToken();
  }
};
