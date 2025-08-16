"use client"

import { Hero } from "@/components/hello"
import { createClient } from "@/lib/supabase/client"
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  useBreakpointValue,
} from "@yamada-ui/react"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js'

export default function Home() {
  // レスポンシブな値の例
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 現在のユーザー情報を取得
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [])
  
  return (
    <VStack alignItems="center" justifyContent="center" minH="100vh">
      <Hero
        description={ "teすと"}
        title={"ugbhnfroigbu"}
        primaryButtonProps={{
          href: "/docs/get-started",
          children: "gnrf",
        }}
        secondaryButtonProps={{
          href: "/docs/components",
          children: "gnhf",
        }}
      />
      <Text>{user?.email}</Text>
    </VStack>
  )
}
