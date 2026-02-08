import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { AuthSession } from "./api-client";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;

  if (typeof obj.user !== "object" || obj.user === null) {
    return false;
  }
  const user = obj.user as Record<string, unknown>;
  if (
    typeof user.id !== "string" ||
    typeof user.email !== "string" ||
    typeof user.name !== "string"
  ) {
    return false;
  }

  if (typeof obj.session !== "object" || obj.session === null) {
    return false;
  }
  const session = obj.session as Record<string, unknown>;
  if (typeof session.id !== "string" || typeof session.expiresAt !== "string") {
    return false;
  }

  return true;
}

function getCookieHeader(): string {
  try {
    return getRequestHeader("cookie") ?? "";
  } catch {
    return "";
  }
}

export const getSessionServer = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const cookie = getCookieHeader();

      const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
        headers: {
          cookie,
        },
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const data: unknown = await response.json();

      if (isAuthSession(data)) {
        return data;
      }

      return null;
    } catch {
      return null;
    }
  }
);
