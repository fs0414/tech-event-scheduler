'use server';

import { prisma } from '@/lib/prisma';
import { requireAuthentication, requireOwnerPermission } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function searchUserByEmail(email: string) {
  try {
    const { dbUser: currentUser } = await requireAuthentication();

    const sanitizedEmail = email.toLowerCase().trim();
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return null;
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (foundUser && foundUser.id === currentUser.id) {
      return null;
    }

    return foundUser;

  } catch (error: any) {
    console.error('ユーザー検索エラー:', error);
    throw error;
  }
}

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

export async function changeUserRole(ownerId: number, eventId: number, newRole: string) {
  try {
    const { dbUser } = await requireAuthentication();
    
    await requireOwnerPermission(dbUser.id, eventId);

    if (!['organizer', 'participant'].includes(newRole)) {
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