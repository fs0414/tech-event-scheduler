import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // プロダクション環境では無効化
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'この機能は開発環境でのみ利用可能です' },
      { status: 403 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードが必要です' },
        { status: 400 }
      );
    }

    const prismaUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!prismaUser) {
      return NextResponse.json(
        { error: `${email} はseedデータに存在しません` },
        { status: 404 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: prismaUser.name
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        return NextResponse.json({ success: true });
      }
      throw error;
    }

    if (data.user) {
      await prisma.user.update({
        where: { email },
        data: { supabaseId: data.user.id }
      });
    }

    return NextResponse.json({ 
      success: true,
      message: `${email} のSupabaseユーザーを作成しました`
    });

  } catch (error: any) {
    console.error('ユーザー作成エラー:', error);
    return NextResponse.json(
      { error: error.message || 'ユーザー作成に失敗しました' },
      { status: 500 }
    );
  }
}
