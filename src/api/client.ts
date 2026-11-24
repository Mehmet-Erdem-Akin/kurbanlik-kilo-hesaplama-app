import { API_URL } from "@/config/env";
import {
  buildAuthHeaders,
  extractSessionToken,
  setStoredToken,
} from "@/api/session";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

const getSetCookieHeader = (response: Response): string | null => {
  const headersWithGetSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithGetSetCookie.getSetCookie === "function") {
    const cookies = headersWithGetSetCookie.getSetCookie();
    if (cookies.length > 0) return cookies.join(", ");
  }

  return (
    response.headers.get("set-cookie") ||
    response.headers.get("Set-Cookie") ||
    null
  );
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", body, auth = true, headers = {} } = options;
  const authHeaders = auth
    ? await buildAuthHeaders(headers)
    : { ...headers };

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const setCookie = getSetCookieHeader(response);
  const tokenFromCookie = extractSessionToken(setCookie);
  if (tokenFromCookie) {
    await setStoredToken(tokenFromCookie);
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload &&
      "error" in payload &&
      typeof (payload as { error?: unknown }).error === "string"
        ? (payload as { error: string }).error
        : typeof payload === "object" &&
            payload &&
            "message" in payload &&
            typeof (payload as { message?: unknown }).message === "string"
          ? (payload as { message: string }).message
          : "İstek başarısız oldu";

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
};
