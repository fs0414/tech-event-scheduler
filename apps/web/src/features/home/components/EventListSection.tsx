import { useCallback } from "react";
import {
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  SimpleGrid,
} from "@yamada-ui/react";
import type { EventResponse } from "@tech-event-scheduler/shared";
import { SimpleEventCard } from "./SimpleEventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

interface EventListSectionProps {
  readonly events: readonly EventResponse[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly onRefresh: () => void;
}

export function EventListSection({
  events,
  loading,
  error,
  onRefresh,
}: EventListSectionProps) {
  const handleViewDetails = useCallback((eventId: number) => {
    console.log(`View event: ${eventId}`);
  }, []);

  return (
    <VStack gap={{ base: 3, md: 4 }} align="stretch">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription fontSize={{ base: "sm", md: "md" }}>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <HStack justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          {loading ? "読み込み中..." : `全 ${events.length} 件`}
        </Text>
        <Button
          variant="ghost"
          size="xs"
          onClick={onRefresh}
          isLoading={loading}
        >
          ↻ 更新
        </Button>
      </HStack>

      <SimpleGrid minChildWidth="280px" gap={{ base: 3, md: 4 }}>
        {loading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : (
          events.map((event) => (
            <SimpleEventCard
              key={event.id}
              event={event}
              onViewDetails={() => handleViewDetails(event.id)}
            />
          ))
        )}
      </SimpleGrid>
    </VStack>
  );
}
