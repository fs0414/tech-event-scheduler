import { VStack } from "@yamada-ui/react";
import { PageLayout } from "@tech-event-scheduler/ui";
import { useEvents } from "~/hooks";
import { HeroSection } from "./HeroSection";
import { EventListSection } from "./EventListSection";

export function HomePage() {
  const { events, loading, error, refetch } = useEvents();

  return (
    <PageLayout>
      <VStack gap={{ base: 6, md: 8 }} align="stretch">
        <HeroSection />
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
