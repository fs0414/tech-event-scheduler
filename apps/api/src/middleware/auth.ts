import { Elysia } from "elysia";
import type { Auth } from "../auth";
import type { AuthenticatedSession } from "../types";

type SessionResult = Awaited<ReturnType<Auth["api"]["getSession"]>>;

function mapSessionResultToAuthenticatedSession(
  sessionResult: NonNullable<SessionResult>
): AuthenticatedSession {
  return {
    user: {
      id: sessionResult.user.id,
      email: sessionResult.user.email,
      name: sessionResult.user.name,
      image: sessionResult.user.image ?? null,
      emailVerified: sessionResult.user.emailVerified,
    },
    session: {
      id: sessionResult.session.id,
      expiresAt: sessionResult.session.expiresAt,
    },
  };
}

export const createAuthMiddleware = (auth: Auth) =>
  new Elysia({ name: "auth-middleware" }).derive(
    async ({ request }): Promise<{ session: AuthenticatedSession | null }> => {
      try {
        const sessionResult: SessionResult = await auth.api.getSession({
          headers: request.headers,
        });

        if (!sessionResult) {
          return { session: null };
        }

        return { session: mapSessionResultToAuthenticatedSession(sessionResult) };
      } catch (error) {
        // デバッグ可能なようにエラーをログ
        console.warn(
          "Auth session retrieval failed:",
          error instanceof Error ? error.message : String(error)
        );
        return { session: null };
      }
    }
  );

export async function requireAuth(
  auth: Auth,
  request: Request
): Promise<AuthenticatedSession | null> {
  try {
    const sessionResult = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResult) {
      return null;
    }

    return mapSessionResultToAuthenticatedSession(sessionResult);
  } catch (error) {
    console.warn(
      "Auth requireAuth failed:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
