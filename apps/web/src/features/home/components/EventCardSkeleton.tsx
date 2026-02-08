import { Card, CardBody, VStack, HStack, Skeleton } from "@yamada-ui/react";

export function EventCardSkeleton() {
  return (
    <Card h="100%">
      <CardBody p={{ base: 3, md: 4 }}>
        <VStack align="stretch" gap={3} h="100%" justify="space-between">
          <VStack align="stretch" gap={2}>
            <HStack justify="space-between" align="flex-start" gap={2}>
              <Skeleton h="20px" w="70%" rounded="md" />
              <Skeleton h="20px" w="40px" rounded="full" />
            </HStack>
            <Skeleton h="14px" w="60%" rounded="md" />
            <Skeleton h="12px" w="40%" rounded="md" />
          </VStack>
          <Skeleton h="32px" w="100%" rounded="md" />
        </VStack>
      </CardBody>
    </Card>
  );
}
