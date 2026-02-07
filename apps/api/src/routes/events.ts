/**
 * イベントAPIルート - Repository パターン実装
 */

import { Elysia, t } from "elysia";
import {
  type EventRepository,
  type OwnerRepository,
  type NewEvent,
  type Event,
} from "@tech-event-scheduler/db";
import {
  eventToResponse,
  type EventResponse,
  success,
  failure,
  ApiErrors,
} from "@tech-event-scheduler/shared";

// === リクエスト/レスポンス型定義 ===

/**
 * イベント作成リクエストボディのスキーマ
 */
const createEventBodySchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 200 }),
  eventUrl: t.Optional(t.String({ format: "uri" })),
});

/**
 * イベント更新リクエストボディのスキーマ
 */
const updateEventBodySchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
  eventUrl: t.Optional(t.Union([t.String({ format: "uri" }), t.Null()])),
  attendance: t.Optional(t.Number({ minimum: 0 })),
});

/**
 * IDパラメータのスキーマ
 */
const idParamSchema = t.Object({
  id: t.String(),
});

// === ヘルパー関数 ===

/**
 * DBのイベントをレスポンス型に変換
 */
function toEventResponse(dbEvent: Event): EventResponse {
  return eventToResponse(dbEvent);
}

// === ルート定義 ===

/**
 * リポジトリ依存
 */
export interface EventRoutesDeps {
  readonly events: EventRepository;
  readonly owners: OwnerRepository;
}

/**
 * イベントルートを作成
 */
export const createEventsRoutes = (deps: EventRoutesDeps) =>
  new Elysia({ prefix: "/api/events" })
    /**
     * イベント一覧取得
     * GET /api/events
     */
    .get("/", async () => {
      const events = await deps.events.findAll();
      const response = events.map(toEventResponse);
      return success(response);
    })
    /**
     * イベント詳細取得
     * GET /api/events/:id
     */
    .get(
      "/:id",
      async ({ params, set }) => {
        const eventId = Number(params.id);
        if (Number.isNaN(eventId)) {
          set.status = 400;
          return failure(ApiErrors.validationError("IDは数値である必要があります"));
        }

        const result = await deps.events.findById(eventId);

        if (!result) {
          set.status = 404;
          return failure(ApiErrors.notFound("イベント"));
        }

        return success(toEventResponse(result));
      },
      {
        params: idParamSchema,
      }
    )
    /**
     * イベント作成
     * POST /api/events
     */
    .post(
      "/",
      async ({ body, set }) => {
        const now = new Date();
        const newEvent: NewEvent = {
          title: body.title,
          eventUrl: body.eventUrl ?? null,
          attendance: 0,
          createdAt: now,
          updatedAt: now,
        };

        const created = await deps.events.create(newEvent);

        set.status = 201;
        return success(toEventResponse(created));
      },
      {
        body: createEventBodySchema,
      }
    )
    /**
     * イベント更新
     * PATCH /api/events/:id
     */
    .patch(
      "/:id",
      async ({ params, body, set }) => {
        const eventId = Number(params.id);
        if (Number.isNaN(eventId)) {
          set.status = 400;
          return failure(ApiErrors.validationError("IDは数値である必要があります"));
        }

        const existing = await deps.events.findById(eventId);

        if (!existing) {
          set.status = 404;
          return failure(ApiErrors.notFound("イベント"));
        }

        const updateData = {
          ...(body.title !== undefined && { title: body.title }),
          ...(body.eventUrl !== undefined && { eventUrl: body.eventUrl }),
          ...(body.attendance !== undefined && { attendance: body.attendance }),
          updatedAt: new Date(),
        };

        const updated = await deps.events.update(eventId, updateData);

        if (!updated) {
          set.status = 500;
          return failure(ApiErrors.internalError("イベントの更新に失敗しました"));
        }

        return success(toEventResponse(updated));
      },
      {
        params: idParamSchema,
        body: updateEventBodySchema,
      }
    )
    /**
     * イベント削除
     * DELETE /api/events/:id
     */
    .delete(
      "/:id",
      async ({ params, set }) => {
        const eventId = Number(params.id);
        if (Number.isNaN(eventId)) {
          set.status = 400;
          return failure(ApiErrors.validationError("IDは数値である必要があります"));
        }

        const exists = await deps.events.exists(eventId);

        if (!exists) {
          set.status = 404;
          return failure(ApiErrors.notFound("イベント"));
        }

        // 関連するオーナーを削除
        await deps.owners.deleteByEventId(eventId);

        // イベントを削除
        await deps.events.delete(eventId);

        return success({ deleted: true as const });
      },
      {
        params: idParamSchema,
      }
    );

/**
 * イベントルートの型
 */
export type EventsRoutes = ReturnType<typeof createEventsRoutes>;
