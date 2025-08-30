'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { OWNER_ROLES } from '@/lib/owner-role';
import { BenchmarkLogger } from '@/lib/benchmark';

// ユーザー検索のServer Action
export async function searchUserByEmail(email: string, excludeUserId?: string) {
  try {
    if (!email || !email.trim()) {
      return { user: null, error: null };
    }

    // メールアドレスの完全一致でユーザーを検索
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
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
    if (excludeUserId && user.id === excludeUserId) {
      return { user: null, error: null };
    }

    return { user, error: null };
  } catch (error) {
    console.error('User search error:', error);
    return { user: null, error: '検索中にエラーが発生しました' };
  }
}

export async function createEvent(formData: FormData) {
  try {
    // 全体の処理時間計測開始
    BenchmarkLogger.start('CreateEvent_Total');
    
    // 認証確認とユーザー情報取得
    const { dbUser: currentUser } = await BenchmarkLogger.measure(
      'CreateEvent_RequireAuth',
      () => requireAuthentication()
    );

    // フォームデータを取得
    const title = formData.get('title') as string;
    const eventUrl = formData.get('eventUrl') as string;
    const attendance = parseInt(formData.get('attendance') as string) || 0;
    const ownerIds = formData.getAll('ownerIds') as string[];

    const sanitizedTitle = title?.trim();
    if (!sanitizedTitle || sanitizedTitle.length === 0) {
      throw new Error('イベント名は必須です');
    }
    if (sanitizedTitle.length > 200) {
      throw new Error('イベント名は200文字以内で入力してください');
    }
    
    const sanitizedEventUrl = eventUrl?.trim();
    if (sanitizedEventUrl) {
      try {
        new URL(sanitizedEventUrl);
      } catch {
        throw new Error('無効なURL形式です');
      }
    }
    
    if (!Number.isInteger(attendance) || attendance < 0 || attendance > 10000) {
      throw new Error('出席者数は0以上10000以下の整数である必要があります');
    }

    // 作成者が必ずownerIdsに含まれているか確認
    if (!ownerIds.includes(currentUser.id)) {
      ownerIds.push(currentUser.id);
    }

    // 指定されたオーナーIDが全て有効か確認
    if (ownerIds.length > 0) {
      const validOwners = await BenchmarkLogger.measure(
        'CreateEvent_ValidateOwners',
        () => prisma.user.findMany({
          where: {
            id: {
              in: ownerIds
            }
          },
          select: {
            id: true
          }
        }),
        { ownerCount: ownerIds.length }
      );

      if (validOwners.length !== ownerIds.length) {
        BenchmarkLogger.end('CreateEvent_Total', { error: 'Invalid owner IDs' });
        throw new Error('無効なオーナーIDが含まれています');
      }
    }

    // トランザクションでイベントとオーナー関係を作成
    const result = await BenchmarkLogger.measure(
      'CreateEvent_Transaction',
      () => prisma.$transaction(async (tx) => {
      // イベントを作成
      const event = await tx.event.create({
        data: {
          title: sanitizedTitle,
          eventUrl: sanitizedEventUrl || null,
          attendance: attendance
        }
      });

      // オーナー関係を作成
      if (ownerIds.length > 0) {
        const ownerData = ownerIds.map(ownerId => ({
          userId: ownerId,
          eventId: event.id,
          role: ownerId === currentUser.id ? OWNER_ROLES.ADMIN : OWNER_ROLES.MEMBER
        }));

        await tx.owner.createMany({
          data: ownerData
        });
      }

      return event;
    }),
      { title: sanitizedTitle, ownerCount: ownerIds.length }
    );

    // キャッシュを無効化
    BenchmarkLogger.measureSync(
      'CreateEvent_RevalidateCache',
      () => {
        revalidatePath('/events');
        revalidatePath(`/events/${result.id}`);
      },
      { eventId: result.id }
    );

    // 全体の処理時間計測終了
    BenchmarkLogger.end('CreateEvent_Total', {
      eventId: result.id,
      title: sanitizedTitle,
      ownerCount: ownerIds.length,
      attendance
    });

    // 作成したイベントページにリダイレクト
    redirect(`/events/${result.id}`);

  } catch (error: any) {
    console.error('イベント作成エラー:', error);
    BenchmarkLogger.end('CreateEvent_Total', { error: error.message });
    throw error;
  }
}
