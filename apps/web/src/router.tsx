import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import type { AuthSession } from "./lib";

export interface RouterContext {
  session: AuthSession | null;
  queryClient: QueryClient;
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5分
        gcTime: 1000 * 60 * 10, // 10分
        refetchOnWindowFocus: false,
      },
    },
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { session: null, queryClient } satisfies RouterContext,
      defaultPreload: "intent",
      defaultPreloadStaleTime: 5 * 60 * 1000, // 5分キャッシュ
      scrollRestoration: true,
    }),
    queryClient
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
