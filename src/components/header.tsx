'use client'

import { Box, Container, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@yamada-ui/react'
import { useAuth } from '@/app/providers'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  isPublic?: boolean
}

export function Header({ isPublic = false }: HeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <Box as="header" shadow="sm" position="sticky" zIndex="sticky">
      <Container maxW="container.xl">
        <Flex h="16" align="center" justify="space-between">
          <Link href="/">
            <Box fontSize="xl" fontWeight="bold">
              テクスケ
            </Box>
          </Link>

          <Flex gap="4" align="center">
            {user ? (
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user.user_metadata.full_name}
                    src={user.user_metadata.avatar_url}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} href="/events">
                    イベント一覧
                  </MenuItem>
                  <MenuItem as={Link} href="/profile">
                    プロフィール
                  </MenuItem>
                  <MenuItem as={Link} href="/settings">
                    設定
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    ログアウト
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link href="/login">
                <Button colorScheme="blue">ログイン</Button>
              </Link>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
