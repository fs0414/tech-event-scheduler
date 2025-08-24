'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuthentication } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

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
    // 認証確認とユーザー情報取得
    const { dbUser: currentUser } = await requireAuthentication();

    // フォームデータを取得
    const title = formData.get('title') as string;
    const eventUrl = formData.get('eventUrl') as string;
    const attendance = parseInt(formData.get('attendance') as string) || 0;
    const ownerIds = formData.getAll('ownerIds') as string[];

    // セキュリティ: 入力値の検証とサニタイゼーション
    const sanitizedTitle = title?.trim();
    if (!sanitizedTitle || sanitizedTitle.length === 0) {
      throw new Error('イベント名は必須です');
    }
    if (sanitizedTitle.length > 200) {
      throw new Error('イベント名は200文字以内で入力してください');
    }
    
    // セキュリティ: URLの検証
    const sanitizedEventUrl = eventUrl?.trim();
    if (sanitizedEventUrl) {
      try {
        new URL(sanitizedEventUrl);
      } catch {
        throw new Error('無効なURL形式です');
      }
    }
    
    // セキュリティ: 出席者数の検証
    if (!Number.isInteger(attendance) || attendance < 0 || attendance > 10000) {
      throw new Error('出席者数は0以上10000以下の整数である必要があります');
    }

    // 作成者が必ずownerIdsに含まれているか確認
    if (!ownerIds.includes(currentUser.id)) {
      ownerIds.push(currentUser.id);
    }

    // 指定されたオーナーIDが全て有効か確認
    if (ownerIds.length > 0) {
      const validOwners = await prisma.user.findMany({
        where: {
          id: {
            in: ownerIds
          }
        },
        select: {
          id: true
        }
      });

      if (validOwners.length !== ownerIds.length) {
        throw new Error('無効なオーナーIDが含まれています');
      }
    }

    // トランザクションでイベントとオーナー関係を作成
    const result = await prisma.$transaction(async (tx) => {
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
          role: ownerId === currentUser.id ? 'organizer' : 'participant'
        }));

        await tx.owner.createMany({
          data: ownerData
        });
      }

      return event;
    });

    // キャッシュを無効化
    revalidatePath('/events');
    revalidatePath(`/events/${result.id}`);

    // 作成したイベントページにリダイレクト
    redirect(`/events/${result.id}`);

  } catch (error: any) {
    console.error('イベント作成エラー:', error);
    throw error;
  }
}