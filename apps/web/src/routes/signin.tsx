import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInPage } from "~/features/auth";

export const Route = createFileRoute("/signin")({
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: SignInPage,
});
