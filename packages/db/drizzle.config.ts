import { defineConfig } from "drizzle-kit";

const isLocal = process.env.DATABASE_URL?.startsWith("http://");

export default defineConfig(
  isLocal
    ? {
        schema: "./src/schema/index.ts",
        out: "./drizzle",
        dialect: "turso",
        dbCredentials: {
          url: process.env.DATABASE_URL!,
        },
      }
    : {
        schema: "./src/schema/index.ts",
        out: "./drizzle",
        dialect: "sqlite",
        driver: "d1-http",
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
          databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
          token: process.env.CLOUDFLARE_API_TOKEN!,
        },
      }
);
