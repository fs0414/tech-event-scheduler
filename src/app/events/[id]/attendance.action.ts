'use server';

import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { BenchmarkLogger } from '@/lib/benchmark';

export async function updateAttendance(eventId: number, isOwner: boolean, newAttendance: number) {
  try {
    // 全体の処理時間計測開始
    BenchmarkLogger.start('UpdateAttendance_Total');
    // 権限チェック（Props経由）
    if (!isOwner) {
      BenchmarkLogger.end('UpdateAttendance_Total', { error: 'Not authorized' });
      throw new Error('このイベントの管理権限がありません');
    }
    
    // 認証確認とユーザー情報取得（なりすまし防止のため維持）
    const { dbUser } = await BenchmarkLogger.measure(
      'UpdateAttendance_RequireAuth',
      () => requireAuthentication(),
      { eventId }
    );

    if (!Number.isInteger(newAttendance) || newAttendance < 0 || newAttendance > 10000) {
      BenchmarkLogger.end('UpdateAttendance_Total', { error: 'Invalid attendance value' });
      throw new Error('出席者数は0以上10000以下の整数である必要があります');
    }

    // 出席者数を更新（連打による競合回避の排他制御）
    const updatedEvent = await BenchmarkLogger.measure(
      'UpdateAttendance_Transaction',
      () => prisma.$transaction(async (tx) => {
      // 現在の値を取得して楽観的ロック
      const currentEvent = await tx.event.findUnique({
        where: { id: eventId },
        select: { attendance: true }
      });

      if (!currentEvent) {
        throw new Error('イベントが見つかりません');
      }

      // 期待される値との差分を計算して更新
      const increment = newAttendance - currentEvent.attendance;
      
      return await tx.event.update({
        where: { id: eventId },
        data: { attendance: { increment } },
        select: { attendance: true }
      });
    }),
      { eventId, newAttendance, userId: dbUser.id }
    );

    // ページをリロード
    BenchmarkLogger.measureSync(
      'UpdateAttendance_RevalidateCache',
      () => revalidatePath(`/events/${eventId}`),
      { eventId }
    );

    // 全体の処理時間計測終了
    BenchmarkLogger.end('UpdateAttendance_Total', {
      eventId,
      newAttendance: updatedEvent.attendance,
      userId: dbUser.id,
      success: true
    });

    return { success: true, newAttendance: updatedEvent.attendance };

  } catch (error: any) {
    console.error('出席者数更新エラー:', error);
    BenchmarkLogger.end('UpdateAttendance_Total', { error: error.message });
    throw error;
  }
}
