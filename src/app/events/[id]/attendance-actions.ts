'use server';

import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function updateAttendance(eventId: number, isOwner: boolean, newAttendance: number) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error('このイベントの管理権限がありません');
    }
    
    // 認証確認とユーザー情報取得（なりすまし防止のため維持）
    const { dbUser } = await requireAuthentication();

    if (!Number.isInteger(newAttendance) || newAttendance < 0 || newAttendance > 10000) {
      throw new Error('出席者数は0以上10000以下の整数である必要があります');
    }

    // 出席者数を更新（連打による競合回避の排他制御）
    const updatedEvent = await prisma.$transaction(async (tx) => {
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
    });

    // ページをリロード
    revalidatePath(`/events/${eventId}`);

    return { success: true, newAttendance: updatedEvent.attendance };

  } catch (error: any) {
    console.error('出席者数更新エラー:', error);
    throw error;
  }
}
