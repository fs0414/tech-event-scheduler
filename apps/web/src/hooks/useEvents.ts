import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { toISO8601, type EventResponse } from "@tech-event-scheduler/shared";
import { eventsQueryOptions } from "~/lib/queries";

const DEMO_EVENTS: readonly EventResponse[] = [
  {
    id: 1,
    title: "React Conf 2025",
    eventUrl: "https://reactconf.dev",
    attendance: 150,
    createdAt: toISO8601(new Date()),
    updatedAt: toISO8601(new Date()),
  },
  {
    id: 2,
    title: "TypeScript Meetup",
    eventUrl: null,
    attendance: 50,
    createdAt: toISO8601(new Date()),
    updatedAt: toISO8601(new Date()),
  },
  {
    id: 3,
    title: "DevOps Days Tokyo",
    eventUrl: "https://devopsdays.org",
    attendance: 200,
    createdAt: toISO8601(new Date()),
    updatedAt: toISO8601(new Date()),
  },
];

export function useEvents() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(eventsQueryOptions());

  const events = data.length > 0 ? data : DEMO_EVENTS;

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  return {
    events,
    refetch,
  };
}
