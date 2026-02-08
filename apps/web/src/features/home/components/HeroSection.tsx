import { Heading, Text, VStack, Button } from "@yamada-ui/react";

export function HeroSection() {
  return (
    <VStack gap={{ base: 3, md: 4 }} align="center" textAlign="center" px={{ base: 2, md: 0 }}>
      <Heading size={{ base: "lg", md: "2xl" }}>Tech Event Scheduler</Heading>
      <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
        テックイベントを見つけて、参加しよう
      </Text>
      <VStack gap={3} w={{ base: "100%", md: "auto" }}>
        <Button
          colorScheme="primary"
          size={{ base: "md", md: "lg" }}
          w={{ base: "100%", md: "auto" }}
        >
          イベントを探す
        </Button>
        <Button
          colorScheme="primary"
          variant="outline"
          size={{ base: "md", md: "lg" }}
          w={{ base: "100%", md: "auto" }}
        >
          イベントを作成
        </Button>
      </VStack>
    </VStack>
  );
}
