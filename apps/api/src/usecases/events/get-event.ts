import type { EventRepository } from "@tech-event-scheduler/db";
import { eventToResponse, type EventResponse } from "@tech-event-scheduler/shared";
import { AppError } from "../../plugins/error-handler";

export interface GetEventDeps {
  readonly events: EventRepository;
}

export async function getEvent(
  deps: GetEventDeps,
  id: number
): Promise<EventResponse> {
  const event = await deps.events.findById(id);
  if (!event) {
    throw AppError.notFound("イベント");
  }
  return eventToResponse(event);
}
