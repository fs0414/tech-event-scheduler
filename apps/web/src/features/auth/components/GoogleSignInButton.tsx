import { useState } from "react";
import { Button, HStack, Text } from "@yamada-ui/react";
import { authApi } from "~/lib/api-client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9.002 18z"
        fill="#34A853"
      />
      <path
        d="M3.966 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.284-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.01-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .957 4.96L3.966 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await authApi.signInWithGoogle();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={loading}
      size={{ base: "lg", md: "lg" }}
      w="100%"
      variant="outline"
      borderColor="gray.300"
      _hover={{ bg: "gray.50" }}
    >
      <HStack gap={3}>
        <GoogleIcon />
        <Text>Googleでログイン</Text>
      </HStack>
    </Button>
  );
}
