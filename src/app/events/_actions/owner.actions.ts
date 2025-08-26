'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuthentication, requireOwnerPermission } from '@/lib/auth-helpers';
import { 
  addOwnerSchema,
  changeOwnerRoleSchema,
  removeOwnerSchema,
  validateAddOwner,
  validateChangeOwnerRole,
  type AddOwnerInput,
  type ChangeOwnerRoleInput,
  type RemoveOwnerInput
} from '@/lib/validations/user';

// オーナーを追加
export async function addOwner(eventId: number, userEmail: string) {
  try {
    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();
    
    // オーナー権限確認
    await requireOwnerPermission(dbUser.id, eventId);

    // Zodスキーマでバリデーション
    const validationResult = addOwnerSchema.safeParse({
      eventId,
      userEmail,
      role: 'member' // デフォルト値
    });
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      throw new Error(firstError?.message || '入力データが無効です');
    }

    const { eventId: validEventId, userEmail: validUserEmail, role } = validationResult.data;

    // 追加するユーザーを検索
    const targetUser = await prisma.user.findUnique({
      where: { email: validUserEmail }
    });

    if (!targetUser) {
      throw new Error('指定されたメールアドレスのユーザーが見つかりません');
    }

    // 既にオーナーかどうか確認
    const existingOwner = await prisma.owner.findFirst({
      where: {
        eventId: validEventId,
        userId: targetUser.id
      }
    });

    if (existingOwner) {
      throw new Error('このユーザーは既にオーナーです');
    }

    // オーナーとして追加
    await prisma.owner.create({
      data: {
        eventId: validEventId,
        userId: targetUser.id,
        role
      }
    });

    // ページをリロード
    revalidatePath(`/events/${validEventId}`);

    return { success: true };

  } catch (error: any) {
    console.error('オーナー追加エラー:', error);
    throw error;
  }
}

// オーナーを削除
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

// 管理者を追加
export async function addOrganizer(eventId: number, userEmail: string) {
  try {
    const { dbUser } = await requireAuthentication();
    
    await requireOwnerPermission(dbUser.id, eventId);

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
        role: 'organizer'
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
export async function changeUserRole(ownerId: number, eventId: number, newRole: string) {
  try {
    const { dbUser } = await requireAuthentication();
    
    await requireOwnerPermission(dbUser.id, eventId);
    
    // Zodスキーマでバリデーション
    const validationResult = changeOwnerRoleSchema.safeParse({
      ownerId,
      eventId,
      newRole
    });
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      throw new Error(firstError?.message || '入力データが無効です');
    }

    const { ownerId: validOwnerId, eventId: validEventId, newRole: validNewRole } = validationResult.data;

    await prisma.owner.update({
      where: { id: validOwnerId },
      data: { role: validNewRole }
    });

    revalidatePath(`/events/${validEventId}`);

    return { success: true };

  } catch (error: any) {
    console.error('ロール変更エラー:', error);
    throw error;
  }
}