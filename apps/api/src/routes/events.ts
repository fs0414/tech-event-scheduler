import { Elysia } from "elysia";
import type { EventRepository, OwnerRepository } from "@tech-event-scheduler/db";
import { success } from "@tech-event-scheduler/shared";
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema,
} from "../schemas";
import { errorHandlerPlugin, AppError } from "../plugins";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../usecases";

export interface EventRoutesDeps {
  readonly events: EventRepository;
  readonly owners: OwnerRepository;
}

const withEventId = new Elysia({ name: "with-event-id" })
  .resolve({ as: "scoped" }, ({ params }) => {
    const parsed = eventIdParamSchema.safeParse(params);
    if (!parsed.success) {
      throw AppError.validationError("無効なIDです", parsed.error.flatten());
    }
    return { eventId: parsed.data.id };
  });

const wrapResponse = new Elysia({ name: "wrap-response" })
  .onAfterHandle(({ response }) => {
    if (
      typeof response === "object" &&
      response !== null &&
      "success" in response
    ) {
      return response;
    }
    return success(response);
  });

export const createEventsRoutes = (deps: EventRoutesDeps) =>
  new Elysia({ prefix: "/api/events" })
    .use(errorHandlerPlugin)
    .use(wrapResponse)
    .get("/", () => listEvents(deps))
    .use(withEventId)
    .get("/:id", ({ eventId }) => getEvent(deps, eventId))
    .post("/", async ({ body, set }) => {
      const parsed = createEventSchema.safeParse(body);
      if (!parsed.success) {
        throw AppError.validationError("無効なリクエストです", parsed.error.flatten());
      }
      set.status = 201;
      return createEvent(deps, parsed.data);
    })
    .patch("/:id", ({ eventId, body }) => {
      const parsed = updateEventSchema.safeParse(body);
      if (!parsed.success) {
        throw AppError.validationError("無効なリクエストです", parsed.error.flatten());
      }
      return updateEvent(deps, { id: eventId, ...parsed.data });
    })
    .delete("/:id", ({ eventId }) => deleteEvent(deps, eventId));

export type EventsRoutes = ReturnType<typeof createEventsRoutes>;
