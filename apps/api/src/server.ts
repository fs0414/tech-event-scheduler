import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createDatabase, createRepositories } from "@tech-event-scheduler/db";
import { createAuth } from "./auth";
import { createEventsRoutes } from "./routes/events";
import { healthRoutes } from "./routes/health";

const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "http://localhost:8080",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-in-production",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3050",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const PORT = Number(process.env.PORT ?? 3050);

const db = createDatabase(env);
const repositories = createRepositories(db);
const auth = createAuth(env);

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
