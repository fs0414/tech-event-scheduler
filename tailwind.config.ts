import type { Config } from "tailwindcss";

export default {
  darkMode: false, // ダークモードを無効化
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#00C4CC",
          hover: "#00A8B0",
          dark: "#009AA1",
        },
        secondary: "#F5F5F5",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E8E8E8",
          300: "#D0D0D0",
          400: "#B8B8B8",
          500: "#999999",
          600: "#666666",
          700: "#555555",
          800: "#333333",
          900: "#1A1A1A",
        },
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
