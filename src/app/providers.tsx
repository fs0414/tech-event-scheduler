"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { ThemeConfig, UIProvider, createColorModeManager, extendTheme } from "@yamada-ui/react";
import { createContext, useContext, useEffect, useState } from "react";

const config: ThemeConfig = {
  initialColorMode: "light",
}

const theme = extendTheme(config);

const colorModeManager = createColorModeManager("cookie");

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function useAuth() {
  return useContext(AuthContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 初期認証状態の確認
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 認証状態の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <UIProvider theme={theme} colorModeManager={colorModeManager}>
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    </UIProvider>
  );
}
