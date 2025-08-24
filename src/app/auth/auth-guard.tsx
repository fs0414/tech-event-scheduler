'use client'

import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { supabaseUser, dbUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !supabaseUser) {
      router.push('/auth/login')
    }
  }, [supabaseUser, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!supabaseUser) {
    return null
  }

  return <>{children}</>
}
