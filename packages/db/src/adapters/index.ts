/**
 * Database Adapters
 *
 * 環境に応じた DatabaseAdapter の作成と公開API
 */

export type {
  DatabaseAdapter,
  DatabaseEnv,
  QueryResult,
  QueryResults,
  WhereCondition,
} from "./types";

export { createD1Adapter } from "./d1.adapter";
export { createLibSQLAdapter, type LibSQLOptions } from "./libsql.adapter";

import { createD1Adapter } from "./d1.adapter";
import { createLibSQLAdapter } from "./libsql.adapter";
import type { DatabaseAdapter, DatabaseEnv } from "./types";

/**
 * 環境変数から適切な DatabaseAdapter を作成
 *
 * @throws {Error} DB または DATABASE_URL が未設定の場合
 */
export function createDatabaseAdapter(env: DatabaseEnv): DatabaseAdapter {
  if (env.DB) {
    return createD1Adapter(env.DB);
  }

  if (env.DATABASE_URL) {
    return createLibSQLAdapter({ url: env.DATABASE_URL });
  }

  throw new Error("DB or DATABASE_URL environment variable is required");
}
