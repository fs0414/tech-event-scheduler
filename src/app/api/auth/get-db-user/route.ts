import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.time('⚡ get-db-user-total');
    console.time('📝 JSON parse');
    
    const { supabaseId } = await request.json();
    console.timeEnd('📝 JSON parse');

    if (!supabaseId) {
      console.timeEnd('⚡ get-db-user-total');
      return NextResponse.json(
        { error: 'Supabase IDが必要です' },
        { status: 400 }
      );
    }

    console.time('🗄️ Prisma query');
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
    console.timeEnd('🗄️ Prisma query');

    console.timeEnd('⚡ get-db-user-total');
    const totalTime = Date.now() - startTime;
    console.log(`✅ get-db-user completed in ${totalTime}ms for user: ${supabaseId}`);

    return NextResponse.json({ user });

  } catch (error: any) {
    console.timeEnd('⚡ get-db-user-total');
    const totalTime = Date.now() - startTime;
    
    console.error(`❌ DBユーザー取得エラー (${totalTime}ms):`, error);
    return NextResponse.json(
      { error: 'ユーザー取得に失敗しました' },
      { status: 500 }
    );
  }
}
