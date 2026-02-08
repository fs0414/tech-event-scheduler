import type { EventRepository } from "@tech-event-scheduler/db";
import { eventToResponse, type EventResponse } from "@tech-event-scheduler/shared";
import { AppError } from "../../plugins/error-handler";

export interface UpdateEventDeps {
  readonly events: EventRepository;
}

export interface UpdateEventInput {
  readonly id: number;
  readonly title?: string;
  readonly eventUrl?: string | null;
  readonly attendance?: number;
}

export async function updateEvent(
  deps: UpdateEventDeps,
  input: UpdateEventInput
): Promise<EventResponse> {
  const existing = await deps.events.findById(input.id);
  if (!existing) {
    throw AppError.notFound("イベント");
  }

  const updateData = {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.eventUrl !== undefined && { eventUrl: input.eventUrl }),
    ...(input.attendance !== undefined && { attendance: input.attendance }),
    updatedAt: new Date(),
  };

  const updated = await deps.events.update(input.id, updateData);
  if (!updated) {
    throw AppError.internal("イベントの更新に失敗しました");
  }

  return eventToResponse(updated);
}
