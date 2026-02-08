import { Elysia } from "elysia";
import type { Auth } from "../auth";
import type { AuthenticatedSession } from "../types";

type SessionResult = Awaited<ReturnType<Auth["api"]["getSession"]>>;

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

        const authenticatedSession: AuthenticatedSession = {
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

        return { session: authenticatedSession };
      } catch {
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
  } catch {
    return null;
  }
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
