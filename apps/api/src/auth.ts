import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDatabase } from "@tech-event-scheduler/db";
import type { Env } from "./types";

export function createAuth(env: Env) {
  const db = createDatabase(env);

  const hasGoogleCredentials = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  console.log("[Auth] Google OAuth configured:", hasGoogleCredentials);
  if (hasGoogleCredentials) {
    console.log("[Auth] Google Client ID:", env.GOOGLE_CLIENT_ID?.slice(0, 20) + "...");
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: hasGoogleCredentials
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {},
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
