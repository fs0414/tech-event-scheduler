'use server';

import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';

export async function searchUserByEmail(email: string) {
  try {
    // 認証確認とユーザー情報取得
    const { dbUser: currentUser } = await requireAuthentication();

    // セキュリティ: 入力値のサニタイゼーション
    const sanitizedEmail = email.toLowerCase().trim();
    
    // セキュリティ: メールアドレス形式の厳密な検証
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return null;
    }

    // メールアドレスの完全一致でユーザーを検索（機密情報を除外）
    const foundUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: {
        id: true,
        name: true,
        email: true
        // セキュリティ: supabaseId, createdAt, updatedAt等は除外
      }
    });

    // 自分自身の場合はnullを返す
    if (foundUser && foundUser.id === currentUser.id) {
      return null;
    }

    return foundUser;

  } catch (error: any) {
    console.error('ユーザー検索エラー:', error);
    throw error;
  }
}