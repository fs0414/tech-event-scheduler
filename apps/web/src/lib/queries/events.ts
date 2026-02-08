import { queryOptions } from "@tanstack/react-query";
import type { EventResponse } from "@tech-event-scheduler/shared";
import { eventsApi, unwrapOrThrow } from "../api-client";

export const eventsQueryOptions = () =>
  queryOptions<readonly EventResponse[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await eventsApi.list();
      return unwrapOrThrow(response);
    },
    staleTime: 1000 * 60 * 5, // 5分
  });

export const eventQueryOptions = (id: string) =>
  queryOptions<EventResponse>({
    queryKey: ["events", id],
    queryFn: async () => {
      const response = await eventsApi.get(id);
      return unwrapOrThrow(response);
    },
    staleTime: 1000 * 60 * 5,
  });
