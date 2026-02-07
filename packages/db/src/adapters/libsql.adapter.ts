/**
 * libSQL (Turso) 用 Database Adapter
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../schema";
import { DrizzleAdapter } from "./drizzle.adapter";
import type { DatabaseAdapter } from "./types";

/**
 * libSQL 接続オプション
 */
export interface LibSQLOptions {
  readonly url: string;
  readonly authToken?: string;
}

/**
 * libSQL から DatabaseAdapter を作成
 */
export function createLibSQLAdapter(options: LibSQLOptions): DatabaseAdapter {
  const client = createClient({
    url: options.url,
    authToken: options.authToken,
  });
  const drizzleInstance = drizzle(client, { schema });
  return new DrizzleAdapter(drizzleInstance);
}
