/**
 * イベントAPIルート - Repository パターン実装
 */

import { Elysia, t } from "elysia";
import {
  type EventRepository,
  type EventParticipantRepository,
  type NewEvent,
  type Event,
} from "@tech-event-scheduler/db";
import {
  generateEventId,
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
  description: t.String({ minLength: 1, maxLength: 5000 }),
  startDate: t.String({ format: "date-time" }),
  endDate: t.String({ format: "date-time" }),
  location: t.Optional(t.String({ maxLength: 200 })),
  url: t.Optional(t.String({ format: "uri" })),
  organizerId: t.String({ format: "uuid" }),
});

/**
 * イベント更新リクエストボディのスキーマ
 */
const updateEventBodySchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
  description: t.Optional(t.String({ minLength: 1, maxLength: 5000 })),
  startDate: t.Optional(t.String({ format: "date-time" })),
  endDate: t.Optional(t.String({ format: "date-time" })),
  location: t.Optional(t.Union([t.String({ maxLength: 200 }), t.Null()])),
  url: t.Optional(t.Union([t.String({ format: "uri" }), t.Null()])),
});

/**
 * IDパラメータのスキーマ
 */
const idParamSchema = t.Object({
  id: t.String({ format: "uuid" }),
});

// === ヘルパー関数 ===

/**
 * DBのイベントをレスポンス型に変換
 */
function toEventResponse(dbEvent: Event): EventResponse {
  return eventToResponse({
    ...dbEvent,
    id: dbEvent.id as import("@tech-event-scheduler/shared").EventId,
    organizerId: dbEvent.organizerId as import("@tech-event-scheduler/shared").UserId,
  });
}

// === ルート定義 ===

/**
 * リポジトリ依存
 */
interface EventRoutesDeps {
  readonly events: EventRepository;
  readonly eventParticipants: EventParticipantRepository;
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
        const result = await deps.events.findById(params.id);

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
        // 日付のバリデーション
        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);

        if (startDate > endDate) {
          set.status = 422;
          return failure(
            ApiErrors.validationError("終了日は開始日以降である必要があります", {
              field: "endDate",
            })
          );
        }

        const now = new Date();
        const newEvent: NewEvent = {
          id: generateEventId(),
          title: body.title,
          description: body.description,
          startDate,
          endDate,
          location: body.location ?? null,
          url: body.url ?? null,
          organizerId: body.organizerId,
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
        // 既存イベントの取得
        const existing = await deps.events.findById(params.id);

        if (!existing) {
          set.status = 404;
          return failure(ApiErrors.notFound("イベント"));
        }

        // 日付のバリデーション
        const startDate = body.startDate
          ? new Date(body.startDate)
          : existing.startDate;
        const endDate = body.endDate
          ? new Date(body.endDate)
          : existing.endDate;

        if (startDate > endDate) {
          set.status = 422;
          return failure(
            ApiErrors.validationError("終了日は開始日以降である必要があります", {
              field: "endDate",
            })
          );
        }

        const updateData = {
          ...(body.title !== undefined && { title: body.title }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.startDate !== undefined && { startDate }),
          ...(body.endDate !== undefined && { endDate }),
          ...(body.location !== undefined && { location: body.location }),
          ...(body.url !== undefined && { url: body.url }),
          updatedAt: new Date(),
        };

        const updated = await deps.events.update(params.id, updateData);

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
        // 既存イベントの確認
        const exists = await deps.events.exists(params.id);

        if (!exists) {
          set.status = 404;
          return failure(ApiErrors.notFound("イベント"));
        }

        // 関連する参加者を削除
        await deps.eventParticipants.deleteByEventId(params.id);

        // イベントを削除
        await deps.events.delete(params.id);

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
