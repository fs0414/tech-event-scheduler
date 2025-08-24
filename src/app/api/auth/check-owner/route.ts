import { NextRequest, NextResponse } from 'next/server';
import { checkOwnerPermission } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId, eventId } = await request.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'ユーザーIDとイベントIDが必要です' },
        { status: 400 }
      );
    }

    const isOwner = await checkOwnerPermission(userId, eventId);

    return NextResponse.json({ isOwner });

  } catch (error: any) {
    console.error('オーナー権限チェックエラー:', error);
    return NextResponse.json(
      { error: '権限チェックに失敗しました' },
      { status: 500 }
    );
  }
}