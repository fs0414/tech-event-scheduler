/**
 * Tech Event Scheduler API
 *
 * Cloudflare Workers + Elysia.js による型安全なAPIサーバー
 */

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import {
  createDatabaseAdapter,
  createRepositories,
} from "@tech-event-scheduler/db";
import { createAuth, type Auth } from "./auth";
import { createEventsRoutes } from "./routes/events";
import { healthRoutes } from "./routes/health";
import type { Env } from "./types";

/**
 * アプリケーションインスタンスを作成
 */
function createApp(
  deps: {
    events: ReturnType<typeof createRepositories>["events"];
    eventParticipants: ReturnType<typeof createRepositories>["eventParticipants"];
  },
  auth: Auth,
  corsOrigin: string
) {
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

/**
 * アプリケーション型（エンドポイント型推論用）
 */
export type App = ReturnType<typeof createApp>;

/**
 * Cloudflare Workers エントリーポイント
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // DatabaseAdapter を作成
    const adapter = createDatabaseAdapter(env);

    // リポジトリを作成（DI）
    const repositories = createRepositories(adapter);

    // 認証を作成
    const auth = createAuth(env);

    // アプリケーションを作成
    const app = createApp(repositories, auth, env.CORS_ORIGIN);

    return app.handle(request);
  },
};
