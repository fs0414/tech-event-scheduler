'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';
import type { AuthenticatedUser } from '@/types/auth';

export async function getCurrentAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser) {
      throw new Error('ユーザー情報が見つかりません');
    }

    return {
      supabaseUser: user,
      dbUser
    };
  } catch (error) {
    console.error('認証ユーザー取得エラー:', error);
    return null;
  }
}

export async function requireAuthentication(): Promise<AuthenticatedUser> {
  const authUser = await getCurrentAuthenticatedUser();
  
  if (!authUser) {
    throw new Error('認証が必要です');
  }
  
  return authUser;
}

export async function checkOwnerPermission(userId: string, eventId: number): Promise<boolean> {
  try {
    const ownerRecord = await prisma.owner.findFirst({
      where: {
        eventId: eventId,
        userId: userId
      }
    });

    return !!ownerRecord;
  } catch (error) {
    console.error('オーナー権限チェックエラー:', error);
    return false;
  }
}

export async function requireOwnerPermission(userId: string, eventId: number): Promise<void> {
  const isOwner = await checkOwnerPermission(userId, eventId);
  
  if (!isOwner) {
    throw new Error('このイベントの管理権限がありません');
  }
}

export async function getCurrentUserForPage(): Promise<User | null> {
  try {
    const authUser = await getCurrentAuthenticatedUser();
    return authUser?.dbUser || null;
  } catch (error) {
    console.error('ページ用ユーザー取得エラー:', error);
    return null;
  }
}

export async function getCurrentUserWithAutoCreate(): Promise<User> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('認証が必要です');
    }

    // 既存ユーザーを検索
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });
    
    if (!dbUser) {
      // ユーザーが存在しない場合は初回ログインとして作成
      dbUser = await prisma.user.create({
        data: {
          id: `user-${Date.now()}`,
          supabaseId: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatarUrl: user.user_metadata?.avatar_url || null
        }
      });
    }
    
    return dbUser;
  } catch (error) {
    console.error('ユーザー取得/作成エラー:', error);
    throw error;
  }
}