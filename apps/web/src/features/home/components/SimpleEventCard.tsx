import {
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
} from "@yamada-ui/react";
import type { EventResponse } from "@tech-event-scheduler/shared";

interface SimpleEventCardProps {
  readonly event: EventResponse;
  readonly onViewDetails: () => void;
}

export function SimpleEventCard({
  event,
  onViewDetails,
}: SimpleEventCardProps) {
  return (
    <Card h="100%">
      <CardBody p={{ base: 3, md: 4 }}>
        <VStack align="stretch" gap={3} h="100%" justify="space-between">
          <VStack align="stretch" gap={2}>
            <HStack justify="space-between" align="flex-start" gap={2}>
              <Heading
                size="sm"
                fontWeight="600"
                lineClamp={2}
                flex={1}
              >
                {event.title}
              </Heading>
              <Badge colorScheme="primary" flexShrink={0}>
                {event.attendance}人
              </Badge>
            </HStack>
            {event.eventUrl && (
              <Text fontSize="xs" color="cyan.600" isTruncated>
                {event.eventUrl}
              </Text>
            )}
            <Text fontSize="xs" color="gray.500">
              作成: {new Date(event.createdAt).toLocaleDateString("ja-JP")}
            </Text>
          </VStack>
          <Button
            size="sm"
            variant="outline"
            colorScheme="primary"
            onClick={onViewDetails}
            w="100%"
          >
            詳細を見る
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
