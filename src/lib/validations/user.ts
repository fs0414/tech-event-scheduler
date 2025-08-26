import { z } from 'zod';

// 共通のバリデーションルール
const emailSchema = z
  .string()
  .min(1, 'メールアドレスは必須です')
  .email('有効なメールアドレスを入力してください')
  .toLowerCase()
  .trim();

const userIdSchema = z
  .string()
  .min(1, 'ユーザーIDは必須です')
  .regex(/^[a-zA-Z0-9\-_]{1,50}$/, '無効なユーザーID形式です');

// ユーザー検索用スキーマ
export const searchUserSchema = z.object({
  email: emailSchema,
  excludeUserId: z.string().optional()
});

// オーナー追加用スキーマ
export const addOwnerSchema = z.object({
  eventId: z.number().int().positive(),
  userEmail: emailSchema,
  role: z.enum(['organizer', 'member']).default('member')
});

// オーナーロール変更用スキーマ
export const changeOwnerRoleSchema = z.object({
  ownerId: z.number().int().positive(),
  eventId: z.number().int().positive(),
  newRole: z.enum(['organizer', 'member'])
});

// オーナー削除用スキーマ
export const removeOwnerSchema = z.object({
  ownerId: z.number().int().positive(),
  eventId: z.number().int().positive()
});

// 型定義をエクスポート
export type SearchUserInput = z.infer<typeof searchUserSchema>;
export type AddOwnerInput = z.infer<typeof addOwnerSchema>;
export type ChangeOwnerRoleInput = z.infer<typeof changeOwnerRoleSchema>;
export type RemoveOwnerInput = z.infer<typeof removeOwnerSchema>;

// バリデーション結果型
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; issues?: z.ZodIssue[] };

// バリデーション実行ヘルパー
export const validateSearchUser = (data: unknown): ValidationResult<SearchUserInput> => {
  try {
    const result = searchUserSchema.parse(data);
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

export const validateAddOwner = (data: unknown): ValidationResult<AddOwnerInput> => {
  try {
    const result = addOwnerSchema.parse(data);
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

export const validateChangeOwnerRole = (data: unknown): ValidationResult<ChangeOwnerRoleInput> => {
  try {
    const result = changeOwnerRoleSchema.parse(data);
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