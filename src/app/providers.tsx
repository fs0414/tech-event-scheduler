"use client";

import { createClient } from "@/lib/supabase/client";
import { ThemeConfig, UIProvider, createColorModeManager, extendTheme } from "@yamada-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User as PrismaUser } from "@prisma/client";
import { AuthContextType } from "@/types/auth";

const config: ThemeConfig = {
  initialColorMode: "light",
}

const theme = extendTheme(config);

const colorModeManager = createColorModeManager("cookie");

const AuthContext = createContext<AuthContextType>({ 
  supabaseUser: null, 
  dbUser: null, 
  loading: true,
  isOwner: async () => false
})

export function useAuth() {
  return useContext(AuthContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [dbUser, setDbUser] = useState<PrismaUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // キャッシュとフラグ
  const [dbUserCache, setDbUserCache] = useState<Map<string, { user: PrismaUser | null; timestamp: number }>>(new Map())
  const [fetchingUsers, setFetchingUsers] = useState<Set<string>>(new Set())
  const CACHE_TTL = 5 * 60 * 1000 // 5分

  // DBユーザー情報を取得する関数（キャッシュ・重複防止機能付き）
  const fetchDbUser = async (supabaseUserId: string): Promise<PrismaUser | null> => {
    // キャッシュチェック
    const cached = dbUserCache.get(supabaseUserId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('🎯 Cache hit for user:', supabaseUserId);
      return cached.user;
    }

    // 重複実行チェック
    if (fetchingUsers.has(supabaseUserId)) {
      console.log('⏱️ Duplicate request prevented for user:', supabaseUserId);
      // 既存のリクエストが完了するまで待機
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!fetchingUsers.has(supabaseUserId)) {
            clearInterval(checkInterval);
            const cached = dbUserCache.get(supabaseUserId);
            resolve(cached?.user || null);
          }
        }, 100);
      });
    }

    // 実行中フラグを設定
    setFetchingUsers(prev => new Set([...prev, supabaseUserId]));
    
    try {
      console.time(`🔍 fetchDbUser-${supabaseUserId}`);
      
      const response = await fetch('/api/auth/get-db-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId: supabaseUserId })
      });
      
      console.timeEnd(`🔍 fetchDbUser-${supabaseUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // キャッシュに保存
        setDbUserCache(prev => new Map(prev.set(supabaseUserId, {
          user: data.user,
          timestamp: Date.now()
        })));
        
        return data.user;
      }
    } catch (error) {
      console.error('DBユーザー取得エラー:', error);
    } finally {
      // 実行中フラグを解除
      setFetchingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(supabaseUserId);
        return newSet;
      });
    }
    return null;
  };

  // オーナー権限チェック関数
  const isOwner = async (eventId: number): Promise<boolean> => {
    if (!dbUser) return false;
    
    try {
      const response = await fetch('/api/auth/check-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dbUser.id, eventId })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.isOwner;
      }
    } catch (error) {
      console.error('オーナー権限チェックエラー:', error);
    }
    return false;
  };

  useEffect(() => {
    // 初期認証状態の確認
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setSupabaseUser(user)
      
      if (user) {
        const dbUserData = await fetchDbUser(user.id);
        setDbUser(dbUserData);
      } else {
        setDbUser(null);
      }
      
      setLoading(false)
    })

    // 認証状態の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        setSupabaseUser(user)
        
        if (user) {
          const dbUserData = await fetchDbUser(user.id);
          setDbUser(dbUserData);
        } else {
          setDbUser(null);
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <UIProvider theme={theme} colorModeManager={colorModeManager}>
      <AuthContext.Provider value={{ supabaseUser, dbUser, loading, isOwner }}>
        {children}
      </AuthContext.Provider>
    </UIProvider>
  );
}
