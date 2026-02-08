import { Elysia, t } from "elysia";

interface HealthResponse {
  readonly status: "ok" | "degraded" | "error";
  readonly timestamp: string;
  readonly version?: string;
}

export const healthRoutes = new Elysia({ prefix: "/health" }).get(
  "/",
  (): HealthResponse => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "0.0.1",
  }),
  {
    response: t.Object({
      status: t.Union([
        t.Literal("ok"),
        t.Literal("degraded"),
        t.Literal("error"),
      ]),
      timestamp: t.String(),
      version: t.Optional(t.String()),
    }),
  }
);

export type HealthRoutes = typeof healthRoutes;
