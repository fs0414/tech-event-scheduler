import { useCallback } from "react";
import {
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
} from "@yamada-ui/react";
import type { EventResponse } from "@tech-event-scheduler/shared";
import { SimpleEventCard } from "./SimpleEventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

interface EventListSectionProps {
  readonly events: readonly EventResponse[];
  readonly onRefresh: () => void;
}

const SKELETON_COUNT = 6;

export function EventListSection({
  events,
  onRefresh,
}: EventListSectionProps) {
  // TODO: イベント詳細ページへの遷移を実装
  const handleViewDetails = useCallback((eventId: number) => {
    console.log(`View event: ${eventId}`);
  }, []);

  return (
    <VStack gap={{ base: 3, md: 4 }} align="stretch">
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          全 {events.length} 件
        </Text>
        <Button variant="ghost" size="xs" onClick={onRefresh}>
          ↻ 更新
        </Button>
      </HStack>

      <SimpleGrid minChildWidth="280px" gap={{ base: 3, md: 4 }}>
        {events.map((event) => (
          <SimpleEventCard
            key={event.id}
            event={event}
            onViewDetails={() => handleViewDetails(event.id)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}

export function EventListSectionSkeleton() {
  return (
    <VStack gap={{ base: 3, md: 4 }} align="stretch">
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          読み込み中...
        </Text>
        <Button variant="ghost" size="xs" isLoading>
          ↻ 更新
        </Button>
      </HStack>

      <SimpleGrid minChildWidth="280px" gap={{ base: 3, md: 4 }}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <EventCardSkeleton key={`skeleton-${i}`} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
