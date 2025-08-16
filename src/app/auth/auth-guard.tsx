'use client'

import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Box, Center } from '@yamada-ui/react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Center h="100vh">
      </Center>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
