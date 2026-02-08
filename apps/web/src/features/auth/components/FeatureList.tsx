import { VStack, HStack, Text, Divider } from "@yamada-ui/react";

const FEATURES = [
  "イベントの作成・管理",
  "タイムスケジュール設定",
  "参加者情報の管理",
] as const;

export function FeatureList() {
  return (
    <VStack w="100%" gap={4} align="stretch">
      <Divider />
      <VStack gap={2} align="stretch">
        {FEATURES.map((feature) => (
          <HStack key={feature} gap={2}>
            <Text color="cyan.500" fontSize="sm" fontWeight="bold">
              ✓
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {feature}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
