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
};

export const theme = extendTheme(customTheme)();
