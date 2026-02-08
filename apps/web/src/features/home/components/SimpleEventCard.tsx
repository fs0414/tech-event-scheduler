import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  Badge,
  Button,
} from "@yamada-ui/react";
import type { EventResponse } from "@tech-event-scheduler/shared";

interface SimpleEventCardProps {
  readonly event: EventResponse;
  readonly onViewDetails: () => void;
}

export function SimpleEventCard({ event, onViewDetails }: SimpleEventCardProps) {
  return (
    <Card>
      <CardHeader py={{ base: 3, md: 4 }}>
        <VStack align="stretch" gap={2}>
          <Heading size={{ base: "sm", md: "md" }}>{event.title}</Heading>
          <Badge colorScheme="primary" w="fit-content">
            {event.attendance}人参加
          </Badge>
        </VStack>
      </CardHeader>
      <CardBody pt={0} pb={{ base: 3, md: 4 }}>
        <VStack align="stretch" gap={3}>
          {event.eventUrl && (
            <Text fontSize={{ base: "xs", md: "sm" }} color="cyan.500" isTruncated>
              {event.eventUrl}
            </Text>
          )}
          <Text fontSize="xs" color="gray.500">
            作成日: {new Date(event.createdAt).toLocaleDateString("ja-JP")}
          </Text>
          <Button
            size={{ base: "md", md: "sm" }}
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
