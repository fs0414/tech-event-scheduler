import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/features/home";
import { eventsQueryOptions } from "~/lib/queries";

export const Route = createFileRoute("/_authenticated/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(eventsQueryOptions());
  },
  component: HomePage,
});
