import { useCallback, useEffect, useState } from "react";
import { isSuccess, toISO8601, type EventResponse } from "@tech-event-scheduler/shared";
import { api } from "~/lib/api-client";

interface EventsState {
  readonly data: readonly EventResponse[];
  readonly loading: boolean;
  readonly error: string | null;
}

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
  const [state, setState] = useState<EventsState>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchEvents = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const response = await api.events.list();

    if (isSuccess(response)) {
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } else {
      setState({
        data: [],
        loading: false,
        error: response.error.message,
      });
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const events = state.data.length > 0 ? state.data : DEMO_EVENTS;

  return {
    events,
    loading: state.loading,
    error: state.error,
    refetch: fetchEvents,
  };
}
