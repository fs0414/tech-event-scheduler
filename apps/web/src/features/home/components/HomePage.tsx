import { Suspense, useCallback } from "react";
import { VStack, Divider, Container } from "@yamada-ui/react";
import { useEvents } from "~/hooks";
import { PageHeader } from "./PageHeader";
import { EventListSection, EventListSectionSkeleton } from "./EventListSection";

export function HomePage() {
  // TODO: イベント作成モーダル/ページへの遷移を実装
  const handleCreateEvent = useCallback(() => {
    console.log("Create event");
  }, []);

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack gap={{ base: 4, md: 6 }} align="stretch">
        <PageHeader onCreateEvent={handleCreateEvent} />
        <Divider />
        <Suspense fallback={<EventListSectionSkeleton />}>
          <EventList />
        </Suspense>
      </VStack>
    </Container>
  );
}

function EventList() {
  const { events, refetch } = useEvents();

  return <EventListSection events={events} onRefresh={refetch} />;
}
