import { z } from 'zod';

// 共通のバリデーションルール
const titleSchema = z
  .string()
  .min(1, 'イベント名は必須です')
  .max(200, 'イベント名は200文字以内で入力してください')
  .trim();

const eventUrlSchema = z
  .string()
  .optional()
  .refine((url) => {
    if (!url || url.trim() === '') return true;
    try {
      new URL(url.trim());
      return true;
    } catch {
      return false;
    }
  }, '無効なURL形式です')
  .transform((url) => url?.trim() || null);

const attendanceSchema = z
  .number()
  .int('出席者数は整数である必要があります')
  .min(0, '出席者数は0以上である必要があります')
  .max(10000, '出席者数は10000以下である必要があります');

// イベント作成用スキーマ
export const createEventSchema = z.object({
  title: titleSchema,
  eventUrl: eventUrlSchema,
  attendance: attendanceSchema,
  ownerIds: z
    .array(z.string())
    .optional()
    .default([])
});

// イベント更新用スキーマ
export const updateEventSchema = z.object({
  id: z.number().int().positive(),
  title: titleSchema.optional(),
  eventUrl: eventUrlSchema,
  attendance: attendanceSchema.optional()
});

// 出席者数更新用スキーマ
export const updateAttendanceSchema = z.object({
  eventId: z.number().int().positive(),
  attendance: attendanceSchema
});

// FormData用スキーマ（Server Actionで使用）
export const createEventFormSchema = z.object({
  title: z.string().min(1, 'イベント名は必須です'),
  eventUrl: z.string().optional(),
  attendance: z
    .string()
    .transform((val) => parseInt(val) || 0)
    .pipe(attendanceSchema),
  ownerIds: z
    .array(z.string())
    .optional()
    .default([])
});

// React Hook Form用スキーマ（フロントエンドで使用）
export const createEventClientSchema = z.object({
  title: z.string().min(1, 'イベント名は必須です'),
  eventUrl: z.string(),
  ownerIds: z.array(z.string())
});

// 型定義をエクスポート
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type CreateEventFormInput = z.infer<typeof createEventFormSchema>;
export type CreateEventClientInput = z.infer<typeof createEventClientSchema>;

// バリデーション結果型
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; issues?: z.ZodIssue[] };

// バリデーション実行ヘルパー
export const validateCreateEvent = (data: unknown): ValidationResult<CreateEventInput> => {
  try {
    const result = createEventSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { 
        success: false, 
        error: firstError?.message || 'バリデーションエラーが発生しました',
        issues: error.issues
      };
    }
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

export const validateUpdateAttendance = (data: unknown): ValidationResult<UpdateAttendanceInput> => {
  try {
    const result = updateAttendanceSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { 
        success: false, 
        error: firstError?.message || 'バリデーションエラーが発生しました',
        issues: error.issues
      };
    }
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};