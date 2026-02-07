import { extendTheme, type UsageTheme } from "@yamada-ui/react";

const customTheme: UsageTheme = {
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.900",
        _dark: {
          bg: "gray.900",
          color: "white",
        },
      },
    },
  },
  colors: {
    brand: {
      50: "#e6f2ff",
      100: "#b3d9ff",
      200: "#80bfff",
      300: "#4da6ff",
      400: "#1a8cff",
      500: "#0073e6",
      600: "#005ab3",
      700: "#004080",
      800: "#00264d",
      900: "#000d1a",
    },
  },
};

export const theme = extendTheme(customTheme)();
