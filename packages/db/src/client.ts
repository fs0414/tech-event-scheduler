import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleLibSQL } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type Database = DrizzleD1Database<typeof schema> | LibSQLDatabase<typeof schema>;

export interface DatabaseEnv {
  readonly DB?: D1Database;
  readonly DATABASE_URL?: string;
}

export function createD1Database(d1: D1Database): DrizzleD1Database<typeof schema> {
  return drizzleD1(d1, { schema });
}

export function createLibSQLDatabase(url: string, authToken?: string): LibSQLDatabase<typeof schema> {
  const client = createClient({ url, authToken });
  return drizzleLibSQL(client, { schema });
}

export function createDatabase(env: DatabaseEnv): Database {
  if (env.DB) {
    return createD1Database(env.DB);
  }

  if (env.DATABASE_URL) {
    return createLibSQLDatabase(env.DATABASE_URL);
  }

  throw new Error("DB or DATABASE_URL environment variable is required");
}
