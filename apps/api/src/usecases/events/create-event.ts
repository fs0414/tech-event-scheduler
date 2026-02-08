import type { EventRepository, NewEvent } from "@tech-event-scheduler/db";
import { eventToResponse, type EventResponse } from "@tech-event-scheduler/shared";

export interface CreateEventDeps {
  readonly events: EventRepository;
}

export interface CreateEventInput {
  readonly title: string;
  readonly eventUrl?: string;
}

export async function createEvent(
  deps: CreateEventDeps,
  input: CreateEventInput
): Promise<EventResponse> {
  const now = new Date();
  const newEvent: NewEvent = {
    title: input.title,
    eventUrl: input.eventUrl ?? null,
    attendance: 0,
    createdAt: now,
    updatedAt: now,
  };

  const created = await deps.events.create(newEvent);
  return eventToResponse(created);
}
