/**
 * ローカル開発用サーバー (Bun)
 *
 * Cloudflare Workers にデプロイ時は index.ts が使用される
 */

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import {
  createDatabaseAdapter,
  createRepositories,
} from "@tech-event-scheduler/db";
import { createAuth } from "./auth";
import { createEventsRoutes } from "./routes/events";
import { healthRoutes } from "./routes/health";

// 環境変数
const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "http://localhost:8080",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-in-production",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3050",
};

const PORT = Number(process.env.PORT ?? 3050);

// Database
const adapter = createDatabaseAdapter(env);
const repositories = createRepositories(adapter);

// Auth
const auth = createAuth(env);

// App
const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  )
  .use(healthRoutes)
  .use(
    createEventsRoutes({
      events: repositories.events,
      owners: repositories.owners,
    })
  )
  .all("/api/auth/*", async ({ request }) => {
    return auth.handler(request);
  })
  .listen(PORT);

console.log(`🚀 API server running at http://localhost:${PORT}`);

export type App = typeof app;
