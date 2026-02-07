/**
 * Database Adapter インターフェース
 *
 * DB接続を抽象化し、環境（D1/libSQL等）に依存しない統一インターフェースを提供
 */

import type { SQL } from "drizzle-orm";
import type {
  SQLiteColumn,
  SQLiteInsertValue,
  SQLiteTable,
  SQLiteUpdateSetSource,
} from "drizzle-orm/sqlite-core";
import type * as schema from "../schema";

/**
 * スキーマ型
 */
export type Schema = typeof schema;

/**
 * クエリ結果の型（単一行）
 */
export type QueryResult<T> = T | undefined;

/**
 * クエリ結果の型（複数行）
 */
export type QueryResults<T> = T[];

/**
 * Where条件の型
 */
export type WhereCondition = SQL | undefined;

/**
 * Order By条件の型
 */
export type OrderByCondition = SQLiteColumn | SQL;

/**
 * Select操作の結果ビルダー
 */
export interface SelectBuilder<T> {
  /**
   * 単一行を取得
   */
  get(): Promise<QueryResult<T>>;

  /**
   * 全行を取得
   */
  all(): Promise<QueryResults<T>>;
}

/**
 * Database Adapter インターフェース
 *
 * 低レベルのDBアクセスを抽象化する
 */
export interface DatabaseAdapter {
  /**
   * テーブルからSELECT
   */
  select<T extends SQLiteTable>(table: T): {
    where(condition: WhereCondition): SelectBuilder<T["$inferSelect"]>;
    orderBy(
      ...columns: OrderByCondition[]
    ): {
      where(condition: WhereCondition): SelectBuilder<T["$inferSelect"]>;
      all(): Promise<QueryResults<T["$inferSelect"]>>;
    };
    all(): Promise<QueryResults<T["$inferSelect"]>>;
  };

  /**
   * テーブルにINSERT
   */
  insert<T extends SQLiteTable>(
    table: T,
    values: SQLiteInsertValue<T>
  ): Promise<void>;

  /**
   * テーブルをUPDATE
   */
  update<T extends SQLiteTable>(
    table: T,
    values: SQLiteUpdateSetSource<T>,
    condition: WhereCondition
  ): Promise<void>;

  /**
   * テーブルからDELETE
   */
  delete<T extends SQLiteTable>(
    table: T,
    condition: WhereCondition
  ): Promise<void>;

  /**
   * トランザクションを実行
   */
  transaction<R>(fn: (tx: DatabaseAdapter) => Promise<R>): Promise<R>;
}

/**
 * Database Adapter ファクトリの環境変数
 */
export interface DatabaseEnv {
  readonly DB?: D1Database;
  readonly DATABASE_URL?: string;
}
