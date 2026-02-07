import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { UIProvider } from "@yamada-ui/react";
import { theme } from "@tech-event-scheduler/ui";
import "~/styles/app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tech Event Scheduler" },
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
