import { useCallback } from "react";
import {
  Heading,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
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
        <Heading size={{ base: "md", md: "lg" }}>注目のイベント</Heading>
        <Button
          variant="ghost"
          size={{ base: "xs", md: "sm" }}
          onClick={onRefresh}
        >
          更新
        </Button>
      </HStack>

      <VStack gap={4} align="stretch">
        {loading ? (
          <>
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
      </VStack>
    </VStack>
  );
}
