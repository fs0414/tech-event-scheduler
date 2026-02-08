import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { isAuthSession } from "@tech-event-scheduler/shared";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

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
