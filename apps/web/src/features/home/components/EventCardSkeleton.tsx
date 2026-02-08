import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
} from "@yamada-ui/react";

export function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.300">
          読み込み中...
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" color="gray.300">
            ・・・・・・
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}
