import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Box, Center, Loading } from "@yamada-ui/react";
import { Header } from "@tech-event-scheduler/ui";
import { authApi, type AuthUser } from "~/lib";
import { isSuccess } from "@tech-event-scheduler/shared";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    return { user: context.session?.user ?? null };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const context = Route.useRouteContext();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(context.user);
  const [loading, setLoading] = useState(!context.user);

  useEffect(() => {
    if (context.user) {
      setUser(context.user);
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      const result = await authApi.getSession();
      if (isSuccess(result) && result.data?.user) {
        setUser(result.data.user);
        setLoading(false);
      } else {
        navigate({ to: "/signin", search: { redirect: window.location.pathname } });
      }
    };
    checkSession();
  }, [context.user, navigate]);

  const handleLogout = async () => {
    await authApi.logout();
    navigate({ to: "/signin" });
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#f8fcfd" _dark={{ bg: "gray.900" }}>
        <Center h="100vh">
          <Loading size="xl" />
        </Center>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box minH="100vh" bg="#f8fcfd" _dark={{ bg: "gray.900" }}>
      <Header user={user} onLogout={handleLogout} />
      <Outlet />
    </Box>
  );
}
