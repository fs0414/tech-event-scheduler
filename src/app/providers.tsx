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

  // DBユーザー情報を取得する関数
  const fetchDbUser = async (supabaseUserId: string) => {
    try {
      const response = await fetch('/api/auth/get-db-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId: supabaseUserId })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
    } catch (error) {
      console.error('DBユーザー取得エラー:', error);
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
