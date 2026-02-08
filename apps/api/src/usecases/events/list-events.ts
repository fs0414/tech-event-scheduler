import type { EventRepository } from "@tech-event-scheduler/db";
import { eventToResponse, type EventResponse } from "@tech-event-scheduler/shared";

export interface ListEventsDeps {
  readonly events: EventRepository;
}

export async function listEvents(
  deps: ListEventsDeps
): Promise<readonly EventResponse[]> {
  const events = await deps.events.findAll();
  return events.map(eventToResponse);
}
