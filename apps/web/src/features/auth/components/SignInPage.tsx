import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, Heading, Text, VStack, Card, CardBody } from "@yamada-ui/react";
import { PageLayout } from "@tech-event-scheduler/ui";
import { authApi } from "~/lib/api-client";
import { isSuccess } from "@tech-event-scheduler/shared";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { BrandLogo } from "./BrandLogo";
import { FeatureList } from "./FeatureList";

export function SignInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const result = await authApi.getSession();
      if (isSuccess(result) && result.data) {
        navigate({ to: "/" });
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <PageLayout centerContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH={{ base: "70vh", md: "80vh" }}
        px={{ base: 4, md: 0 }}
      >
        <Card
          w={{ base: "100%", md: "sm" }}
          maxW="sm"
          shadow="sm"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.700" }}
        >
          <CardBody p={{ base: 6, md: 8 }}>
            <VStack gap={6} align="stretch">
              <VStack gap={4} align="center">
                <BrandLogo />
                <VStack gap={1} align="center">
                  <Heading size="md" textAlign="center" fontWeight="600">
                    テクスケ
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    textAlign="center"
                    _dark={{ color: "gray.400" }}
                  >
                    テックイベントを効率的に管理
                  </Text>
                </VStack>
              </VStack>
              <GoogleSignInButton />
              <FeatureList />
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </PageLayout>
  );
}
