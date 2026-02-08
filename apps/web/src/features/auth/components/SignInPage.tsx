import { Box, Heading, VStack } from "@yamada-ui/react";
import { PageLayout } from "@tech-event-scheduler/ui";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function SignInPage() {
  return (
    <PageLayout>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH={{ base: "60vh", md: "70vh" }}
        px={{ base: 4, md: 0 }}
      >
        <VStack
          gap={{ base: 6, md: 8 }}
          w={{ base: "100%", md: "sm" }}
          maxW="sm"
          align="center"
        >
          <Heading size={{ base: "lg", md: "xl" }} textAlign="center">
            Tech Event Scheduler
          </Heading>
          <Box w="100%">
            <GoogleSignInButton />
          </Box>
        </VStack>
      </Box>
    </PageLayout>
  );
}
