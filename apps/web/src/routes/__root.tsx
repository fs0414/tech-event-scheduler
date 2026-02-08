import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { UIProvider } from "@yamada-ui/react";
import { theme } from "@tech-event-scheduler/ui";
import { getSessionServer } from "~/lib";
import type { RouterContext } from "~/router";
import "~/styles/app.css";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    try {
      const session = await getSessionServer();
      return { session };
    } catch {
      return { session: null };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "テクスケ" },
      { name: "description", content: "テックイベントの管理・スケジュール" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <UIProvider theme={theme}>
          <Outlet />
        </UIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
