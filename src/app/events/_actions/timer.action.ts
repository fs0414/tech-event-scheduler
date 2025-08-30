'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';

// タイマーセッションを追加
export async function addTimerSession(eventId: number, isOwner: boolean, durationMinutes: number) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このイベントのタイマーを編集する権限がありません');
    }
    
    // 認証確認（なりすまし防止のため維持）
    const { dbUser: currentUser } = await requireAuthentication();

    // 次のsequence番号を取得
    const lastTimer = await prisma.timer.findFirst({
      where: { eventId },
      orderBy: { sequence: 'desc' }
    });

    const nextSequence = lastTimer ? lastTimer.sequence + 1 : 1;

    // タイマーを作成
    const timer = await prisma.timer.create({
      data: {
        eventId,
        durationMinutes,
        sequence: nextSequence
      }
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, timer };
  } catch (error) {
    console.error('Timer creation error:', error);
    throw error;
  }
}

// タイマーセッションを更新
export async function updateTimerSession(timerId: number, isOwner: boolean, durationMinutes: number) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このタイマーを編集する権限がありません');
    }
    
    // 認証確認（なりすまし防止のため維持）
    const { dbUser: currentUser } = await requireAuthentication();

    // タイマーとイベント情報を取得
    const timer = await prisma.timer.findUnique({
      where: { id: timerId },
      include: { event: true }
    });

    if (!timer) {
      throw new Error('タイマーが見つかりません');
    }

    // タイマーを更新
    const updatedTimer = await prisma.timer.update({
      where: { id: timerId },
      data: { durationMinutes }
    });

    revalidatePath(`/events/${timer.eventId}`);
    return { success: true, timer: updatedTimer };
  } catch (error) {
    console.error('Timer update error:', error);
    throw error;
  }
}

// タイマーセッションを削除
export async function deleteTimerSession(timerId: number, isOwner: boolean) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このタイマーを削除する権限がありません');
    }
    
    // 認証確認（なりすまし防止のため維持）
    const { dbUser: currentUser } = await requireAuthentication();

    // タイマーとイベント情報を取得
    const timer = await prisma.timer.findUnique({
      where: { id: timerId },
      include: { event: true }
    });

    if (!timer) {
      throw new Error('タイマーが見つかりません');
    }

    const eventId = timer.eventId;

    // タイマーを削除
    await prisma.timer.delete({
      where: { id: timerId }
    });

    // sequence番号を再調整
    const remainingTimers = await prisma.timer.findMany({
      where: { eventId },
      orderBy: { sequence: 'asc' }
    });

    await prisma.$transaction(
      remainingTimers.map((t, index) =>
        prisma.timer.update({
          where: { id: t.id },
          data: { sequence: index + 1 }
        })
      )
    );

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error('Timer deletion error:', error);
    throw error;
  }
}

// タイマーの順序を変更
export async function reorderTimerSessions(eventId: number, timerIds: number[]) {
  try {
    const { dbUser: currentUser } = await requireAuthentication();

    // 現在のユーザーがイベントのオーナーかチェック
    const isOwner = await prisma.owner.findFirst({
      where: {
        eventId,
        userId: currentUser.id
      }
    });

    if (!isOwner) {
      throw new Error('このイベントのタイマー順序を変更する権限がありません');
    }

    // タイマーの順序を更新
    await prisma.$transaction(
      timerIds.map((timerId, index) =>
        prisma.timer.update({
          where: { id: timerId },
          data: { sequence: index + 1 }
        })
      )
    );

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error('Timer reorder error:', error);
    throw error;
  }
}