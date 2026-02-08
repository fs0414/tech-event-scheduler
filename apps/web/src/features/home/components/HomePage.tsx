import { useCallback } from "react";
import { VStack, Divider } from "@yamada-ui/react";
import { PageLayout } from "@tech-event-scheduler/ui";
import { useEvents } from "~/hooks";
import { PageHeader } from "./PageHeader";
import { EventListSection } from "./EventListSection";

export function HomePage() {
  const { events, loading, error, refetch } = useEvents();

  const handleCreateEvent = useCallback(() => {
    console.log("Create event");
  }, []);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
