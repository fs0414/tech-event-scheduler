'use server';

import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';
import { 
  searchUserSchema,
  validateSearchUser,
  type SearchUserInput
} from '@/lib/validations/user';

// メールアドレスでユーザーを検索（共通処理）
export async function searchUserByEmail(email: string, excludeUserId?: string) {
  try {
    // Zodスキーマでバリデーション
    const validationResult = searchUserSchema.safeParse({
      email,
      excludeUserId
    });
    
    if (!validationResult.success) {
      return { user: null, error: null };
    }

    const { email: validEmail, excludeUserId: validExcludeUserId } = validationResult.data;

    // メールアドレスの完全一致でユーザーを検索
    const user = await prisma.user.findUnique({
      where: {
        email: validEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // ユーザーが見つからない場合
    if (!user) {
      return { user: null, error: null };
    }

    // 除外対象ユーザー（作成者や既に選択済みのユーザー）の場合は返さない
    if (validExcludeUserId && user.id === validExcludeUserId) {
      return { user: null, error: null };
    }

    return { user, error: null };
  } catch (error) {
    console.error('User search error:', error);
    return { user: null, error: '検索中にエラーが発生しました' };
  }
}

// メールアドレスでユーザーを検索（認証付き）
export async function searchUserByEmailAuth(email: string) {
  try {
    const { dbUser: currentUser } = await requireAuthentication();

    // Zodスキーマでバリデーション
    const validationResult = searchUserSchema.safeParse({
      email,
      excludeUserId: currentUser.id
    });
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return { user: null, error: firstError?.message || 'メールアドレスが無効です' };
    }

    const { email: validEmail } = validationResult.data;

    // バリデーション済みのメールアドレスでユーザー検索
    const foundUser = await prisma.user.findUnique({
      where: { email: validEmail },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (foundUser && foundUser.id === currentUser.id) {
      return { user: null, error: null };
    }

    if (!foundUser) {
      return { user: null, error: null };
    }

    return { user: foundUser, error: null };

  } catch (error: any) {
    console.error('ユーザー検索エラー:', error);
    return { user: null, error: '検索中にエラーが発生しました' };
  }
}