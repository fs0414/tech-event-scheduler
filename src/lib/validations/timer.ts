import { z } from "zod";

// 共通のバリデーションルール
const titleSchema = z
  .string()
  .min(1, "タイマー名は必須です")
  .max(100, "タイマー名は100文字以内で入力してください")
  .trim();

const durationSchema = z
  .number()
  .int("時間は整数である必要があります")
  .min(1, "時間は1秒以上である必要があります")
  .max(86400, "時間は24時間以下である必要があります"); // 24時間 = 86400秒

const sequenceSchema = z
  .number()
  .int("順序は整数である必要があります")
  .min(0, "順序は0以上である必要があります");

// タイマー作成用スキーマ
export const createTimerSchema = z.object({
  eventId: z.number().int().positive(),
  title: titleSchema,
  duration: durationSchema,
  sequence: sequenceSchema.optional(),
});

// タイマー更新用スキーマ
export const updateTimerSchema = z.object({
  id: z.number().int().positive(),
  eventId: z.number().int().positive(),
  title: titleSchema.optional(),
  duration: durationSchema.optional(),
  sequence: sequenceSchema.optional(),
});

// タイマー削除用スキーマ
export const deleteTimerSchema = z.object({
  id: z.number().int().positive(),
  eventId: z.number().int().positive(),
});

// タイマー順序更新用スキーマ
export const updateTimerSequenceSchema = z.object({
  eventId: z.number().int().positive(),
  timers: z.array(
    z.object({
      id: z.number().int().positive(),
      sequence: sequenceSchema,
    }),
  ),
});

// FormData用スキーマ（フォームから送信されるデータ）
export const createTimerFormSchema = z
  .object({
    eventId: z
      .string()
      .transform((val) => parseInt(val))
      .pipe(z.number().int().positive()),
    title: z.string().min(1, "タイマー名は必須です"),
    minutes: z
      .string()
      .transform((val) => parseInt(val) || 0)
      .pipe(z.number().int().min(0).max(1440)), // 最大24時間
    seconds: z
      .string()
      .transform((val) => parseInt(val) || 0)
      .pipe(z.number().int().min(0).max(59)),
  })
  .transform((data) => ({
    ...data,
    duration: data.minutes * 60 + data.seconds,
  }));

// 型定義をエクスポート
export type CreateTimerInput = z.infer<typeof createTimerSchema>;
export type UpdateTimerInput = z.infer<typeof updateTimerSchema>;
export type DeleteTimerInput = z.infer<typeof deleteTimerSchema>;
export type UpdateTimerSequenceInput = z.infer<
  typeof updateTimerSequenceSchema
>;
export type CreateTimerFormInput = z.infer<typeof createTimerFormSchema>;

// バリデーション結果型
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; issues?: z.ZodIssue[] };

// バリデーション実行ヘルパー
export const validateCreateTimer = (
  data: unknown,
): ValidationResult<CreateTimerInput> => {
  try {
    const result = createTimerSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "バリデーションエラーが発生しました",
        issues: error.issues,
      };
    }
    return { success: false, error: "予期しないエラーが発生しました" };
  }
};

export const validateUpdateTimer = (
  data: unknown,
): ValidationResult<UpdateTimerInput> => {
  try {
    const result = updateTimerSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "バリデーションエラーが発生しました",
        issues: error.issues,
      };
    }
    return { success: false, error: "予期しないエラーが発生しました" };
  }
};

export const validateDeleteTimer = (
  data: unknown,
): ValidationResult<DeleteTimerInput> => {
  try {
    const result = deleteTimerSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "バリデーションエラーが発生しました",
        issues: error.issues,
      };
    }
    return { success: false, error: "予期しないエラーが発生しました" };
  }
};
