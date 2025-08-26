'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuthentication, requireOwnerPermission } from '@/lib/auth-helpers';
import { OWNER_ROLES } from '@/lib/owner-role';

// オーナーを追加
export async function addOwner(eventId: number, isOwner: boolean, userEmail: string) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このイベントの管理権限がありません');
    }
    
    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();

    const sanitizedEmail = userEmail.toLowerCase().trim();
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('有効なメールアドレスを入力してください');
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
        role: OWNER_ROLES.MEMBER
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

// オーナーを削除
export async function removeOwner(eventId: number, isOwner: boolean, userId: string) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このイベントの管理権限がありません');
    }
    
    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();

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

// 管理者を追加
export async function addOrganizer(eventId: number, isOwner: boolean, userEmail: string) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このイベントの管理権限がありません');
    }

    // 認証ユーザー取得（なりすまし防止のため維持）
    const { dbUser } = await requireAuthentication();

    const sanitizedEmail = userEmail.toLowerCase().trim();
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('有効なメールアドレスを入力してください');
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: { id: true, name: true, email: true }
    });

    if (!targetUser) {
      throw new Error('指定されたメールアドレスのユーザーが見つかりません');
    }

    const existingOwner = await prisma.owner.findUnique({
      where: {
        userId_eventId: {
          userId: targetUser.id,
          eventId: eventId
        }
      }
    });

    if (existingOwner) {
      throw new Error('このユーザーは既に参加者として登録されています');
    }

    await prisma.owner.create({
      data: {
        userId: targetUser.id,
        eventId: eventId,
        role: OWNER_ROLES.ADMIN
      }
    });

    revalidatePath(`/events/${eventId}`);

    return { success: true, user: targetUser };

  } catch (error: any) {
    console.error('管理者追加エラー:', error);
    throw error;
  }
}

// ユーザーのロールを変更
export async function changeUserRole(ownerId: number, eventId: number, isOwner: boolean, newRole: number) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このイベントの管理権限がありません');
    }
    
    const { dbUser } = await requireAuthentication();
    
    if (newRole !== OWNER_ROLES.ADMIN && newRole !== OWNER_ROLES.MEMBER) {
      throw new Error('無効なロールです');
    }

    await prisma.owner.update({
      where: { id: ownerId },
      data: { role: newRole }
    });

    revalidatePath(`/events/${eventId}`);

    return { success: true };

  } catch (error: any) {
    console.error('ロール変更エラー:', error);
    throw error;
  }
}