'use server';

import { prisma } from '@/lib/prisma';
import { requireAuthentication, requireOwnerPermission } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function addOwner(eventId: number, userEmail: string) {
  try {
    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();
    
    // オーナー権限確認
    await requireOwnerPermission(dbUser.id, eventId);

    const sanitizedEmail = userEmail.toLowerCase().trim();
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('無効なメールアドレス形式です');
    }

    // 追加するユーザーを検索
    const targetUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (!targetUser) {
      throw new Error('指定されたメールアドレスのユーザーが見つかりません');
    }

    // 既にオーナーかどうか確認
    const existingOwner = await prisma.owner.findFirst({
      where: {
        eventId: eventId,
        userId: targetUser.id
      }
    });

    if (existingOwner) {
      throw new Error('このユーザーは既にオーナーです');
    }

    // オーナーとして追加
    await prisma.owner.create({
      data: {
        eventId: eventId,
        userId: targetUser.id,
        role: 'participant'
      }
    });

    // ページをリロード
    revalidatePath(`/events/${eventId}`);

    return { success: true };

  } catch (error: any) {
    console.error('オーナー追加エラー:', error);
    throw error;
  }
}

export async function removeOwner(eventId: number, userId: string) {
  try {
    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();
    
    // オーナー権限確認
    await requireOwnerPermission(dbUser.id, eventId);

    // 自分自身は削除できない
    if (userId === dbUser.id) {
      throw new Error('自分自身をオーナーから削除することはできません');
    }

    // オーナーを削除
    await prisma.owner.deleteMany({
      where: {
        eventId: eventId,
        userId: userId
      }
    });

    // ページをリロード
    revalidatePath(`/events/${eventId}`);

    return { success: true };

  } catch (error: any) {
    console.error('オーナー削除エラー:', error);
    throw error;
  }
}
