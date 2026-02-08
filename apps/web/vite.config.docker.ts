/**
 * Docker 開発用 Vite 設定
 * @cloudflare/vite-plugin は Bun と互換性がないため除外
 */
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3040,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "localhost",
      port: 3040,
    },
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    viteReact(),
  ],
});
