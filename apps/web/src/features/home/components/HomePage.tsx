import { useCallback } from "react";
import { VStack, Divider, Container } from "@yamada-ui/react";
import { useEvents } from "~/hooks";
import { PageHeader } from "./PageHeader";
import { EventListSection } from "./EventListSection";

export function HomePage() {
  const { events, loading, error, refetch } = useEvents();

  // TODO: イベント作成モーダル/ページへの遷移を実装
  const handleCreateEvent = useCallback(() => {
    console.log("Create event");
  }, []);

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack gap={{ base: 4, md: 6 }} align="stretch">
        <PageHeader onCreateEvent={handleCreateEvent} />
        <Divider />
        <EventListSection
          events={events}
          loading={loading}
          error={error}
          onRefresh={refetch}
        />
      </VStack>
    </Container>
  );
}
