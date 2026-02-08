import { Center, Box, Text } from "@yamada-ui/react";

export function BrandLogo() {
  return (
    <Center>
      <Box
        p={3}
        bg="cyan.50"
        rounded="full"
        w="56px"
        h="56px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        _dark={{
          bg: "cyan.900",
        }}
      >
        <Text fontSize="2xl" color="cyan.500">
          📅
        </Text>
      </Box>
    </Center>
  );
}
