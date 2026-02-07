/**
 * Zodバリデーションスキーマ - 型とバリデーションの統合
 */

import { z } from "zod";
import { PARTICIPANT_STATUS_VALUES } from "../types/enums";

// === 共通バリデーション ===

/**
 * UUID形式のバリデーション
 */
export const uuidSchema = z.string().uuid("有効なUUID形式である必要があります");

/**
 * ISO8601日付文字列のバリデーション
 */
export const isoDateStringSchema = z
  .string()
  .datetime({ message: "有効なISO8601形式の日付である必要があります" });

/**
 * メールアドレスのバリデーション
 */
export const emailSchema = z
  .string()
  .email("有効なメールアドレスである必要があります")
  .max(255, "メールアドレスは255文字以内である必要があります");

/**
 * URLのバリデーション（オプショナル）
 */
export const optionalUrlSchema = z
  .string()
  .url("有効なURL形式である必要があります")
  .optional()
  .or(z.literal(""));

// === イベントスキーマ ===

/**
 * イベント作成リクエストスキーマ
 */
export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルは必須です")
      .max(200, "タイトルは200文字以内である必要があります"),
    description: z
      .string()
      .min(1, "説明は必須です")
      .max(5000, "説明は5000文字以内である必要があります"),
    startDate: isoDateStringSchema,
    endDate: isoDateStringSchema,
    location: z
      .string()
      .max(200, "場所は200文字以内である必要があります")
      .optional(),
    url: optionalUrlSchema,
    organizerId: uuidSchema,
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    {
      message: "終了日は開始日以降である必要があります",
      path: ["endDate"],
    }
  );

export type CreateEventSchemaInput = z.input<typeof createEventSchema>;
export type CreateEventSchemaOutput = z.output<typeof createEventSchema>;

/**
 * イベント更新リクエストスキーマ
 */
export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルは必須です")
      .max(200, "タイトルは200文字以内である必要があります")
      .optional(),
    description: z
      .string()
      .min(1, "説明は必須です")
      .max(5000, "説明は5000文字以内である必要があります")
      .optional(),
    startDate: isoDateStringSchema.optional(),
    endDate: isoDateStringSchema.optional(),
    location: z
      .string()
      .max(200, "場所は200文字以内である必要があります")
      .nullish(),
    url: z.string().url().nullish().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "終了日は開始日以降である必要があります",
      path: ["endDate"],
    }
  );

export type UpdateEventSchemaInput = z.input<typeof updateEventSchema>;

/**
 * イベントIDパラメータスキーマ
 */
export const eventIdParamSchema = z.object({
  id: uuidSchema,
});

// === イベント参加者スキーマ ===

/**
 * 参加ステータススキーマ
 */
export const participantStatusSchema = z.enum(
  PARTICIPANT_STATUS_VALUES as unknown as [string, ...string[]]
);

/**
 * 参加登録リクエストスキーマ
 */
export const registerParticipantSchema = z.object({
  eventId: uuidSchema,
  userId: uuidSchema,
});

/**
 * 参加ステータス更新スキーマ
 */
export const updateParticipantStatusSchema = z.object({
  status: participantStatusSchema,
});

// === ユーザースキーマ ===

/**
 * ユーザー登録スキーマ
 */
export const registerUserSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "パスワードは8文字以上である必要があります")
    .max(100, "パスワードは100文字以内である必要があります"),
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(100, "名前は100文字以内である必要があります"),
});

export type RegisterUserSchemaInput = z.input<typeof registerUserSchema>;

/**
 * ログインスキーマ
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "パスワードは必須です"),
});

export type LoginSchemaInput = z.input<typeof loginSchema>;

// === ページネーションスキーマ ===

/**
 * ページネーションクエリスキーマ
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationSchemaInput = z.input<typeof paginationSchema>;
export type PaginationSchemaOutput = z.output<typeof paginationSchema>;
