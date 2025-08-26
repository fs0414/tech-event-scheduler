import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { supabaseId } = await request.json();

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'Supabase IDが必要です' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user });

  } catch (error: any) {
    console.error('DBユーザー取得エラー:', error);
    return NextResponse.json(
      { error: 'ユーザー取得に失敗しました' },
      { status: 500 }
    );
  }
}
