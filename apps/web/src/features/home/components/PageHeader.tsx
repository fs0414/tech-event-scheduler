import { HStack, Heading, Button, Text } from "@yamada-ui/react";

interface PageHeaderProps {
  readonly onCreateEvent: () => void;
}

export function PageHeader({ onCreateEvent }: PageHeaderProps) {
  return (
    <HStack justify="space-between" align="center" py={{ base: 2, md: 4 }}>
      <Heading size="sm" fontWeight="600">
        テクスケ
      </Heading>
      <Button
        size={{ base: "sm", md: "md" }}
        colorScheme="primary"
        onClick={onCreateEvent}
      >
        <Text as="span" mr={1}>
          +
        </Text>
        イベントを作成
      </Button>
    </HStack>
  );
}
