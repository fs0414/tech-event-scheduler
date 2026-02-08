import type { EventRepository, OwnerRepository } from "@tech-event-scheduler/db";
import { AppError } from "../../plugins/error-handler";

export interface DeleteEventDeps {
  readonly events: EventRepository;
  readonly owners: OwnerRepository;
}

export async function deleteEvent(
  deps: DeleteEventDeps,
  id: number
): Promise<{ deleted: true }> {
  const exists = await deps.events.exists(id);
  if (!exists) {
    throw AppError.notFound("イベント");
  }

  await deps.owners.deleteByEventId(id);
  await deps.events.delete(id);

  return { deleted: true };
}
