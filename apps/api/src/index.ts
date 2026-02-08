import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createDatabase, createRepositories } from "@tech-event-scheduler/db";
import { createAuth, type Auth } from "./auth";
import { createEventsRoutes, type EventRoutesDeps } from "./routes/events";
import { healthRoutes } from "./routes/health";
import type { Env } from "./types";

function createApp(deps: EventRoutesDeps, auth: Auth, corsOrigin: string) {
  return new Elysia()
    .use(
      cors({
        origin: corsOrigin,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      })
    )
    .use(healthRoutes)
    .use(createEventsRoutes(deps))
    .all("/api/auth/*", async ({ request }) => {
      return auth.handler(request);
    });
}

export type App = ReturnType<typeof createApp>;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = createDatabase(env);
    const repositories = createRepositories(db);
    const auth = createAuth(env);

    const app = createApp(
      { events: repositories.events, owners: repositories.owners },
      auth,
      env.CORS_ORIGIN
    );

    return app.handle(request);
  },
};
