import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { AuthSession } from "./lib";

export interface RouterContext {
  session: AuthSession | null;
}

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    context: { session: null } satisfies RouterContext,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 5 * 60 * 1000, // 5分キャッシュ
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
