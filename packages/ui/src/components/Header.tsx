import {
  Box,
  HStack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Container,
} from "@yamada-ui/react";
import { LogOutIcon, UserIcon } from "@yamada-ui/lucide";
import type { FC } from "react";

export interface HeaderUser {
  name: string;
  email: string;
  image: string | null;
}

export interface HeaderProps {
  readonly user: HeaderUser;
  readonly onLogout: () => void;
}

export const Header: FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <Box
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      py={3}
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
    >
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg" color="gray.800" _dark={{ color: "white" }}>
            テクスケ
          </Text>
          <Menu>
            <MenuButton
              as={Box}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
            >
              <HStack gap={2}>
                <Avatar
                  name={user.name}
                  src={user.image ?? undefined}
                  size="sm"
                />
                <Text
                  fontSize="sm"
                  color="gray.700"
                  _dark={{ color: "gray.200" }}
                  display={{ base: "none", md: "block" }}
                >
                  {user.name}
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<UserIcon size="sm" />}
                isDisabled
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                {user.email}
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<LogOutIcon size="sm" />}
                onClick={onLogout}
                color="red.500"
                _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
              >
                ログアウト
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Container>
    </Box>
  );
};
