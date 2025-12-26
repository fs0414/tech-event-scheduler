import { redirect } from "next/navigation";
import EventsList from "@/components/events-list";
import EventsPageHeader from "@/components/events-page-header";
import { getCurrentUserWithAutoCreate } from "@/lib/auth-helpers";
import { getEventStats, getEventsForUser } from "@/lib/data";
import { cn, UI_CONSTANTS } from "@/lib/ui-constants";

export const dynamic = "force-dynamic";

interface EventsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { search } = await searchParams;

  try {
    const dbUser = await getCurrentUserWithAutoCreate();

    const [events, stats] = await Promise.all([
      getEventsForUser(dbUser.id, search),
      getEventStats(dbUser.id),
    ]);

    const filteredEvents = search
      ? events.filter((event) =>
          event.title.toLowerCase().includes(search.toLowerCase()),
        )
      : events;

    return (
      <div
        className={cn(
          "max-w-7xl mx-auto py-8 min-h-screen",
          UI_CONSTANTS.colors.pageBg,
        )}
      >
        <EventsPageHeader initialSearch={search} />
        <EventsList events={filteredEvents} />
      </div>
    );
  } catch (error) {
    console.error("Events page error:", error);
    redirect("/auth/login");
  }
}
