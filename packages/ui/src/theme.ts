import { extendTheme, type UsageTheme } from "@yamada-ui/react";

const customTheme: UsageTheme = {
  styles: {
    global: {
      body: {
        bg: "#f8fcfd",
        color: "gray.800",
        _dark: {
          bg: "gray.900",
          color: "white",
        },
      },
    },
  },
  semantics: {
    colorSchemes: {
      primary: "cyan",
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          borderWidth: "1px",
          borderColor: "gray.200",
          transition: "all 0.2s",
          _hover: {
            borderColor: "cyan.400",
            shadow: "sm",
          },
          _dark: {
            borderColor: "gray.700",
            _hover: {
              borderColor: "cyan.400",
            },
          },
        },
      },
    },
  },
};

export const theme = extendTheme(customTheme)();
