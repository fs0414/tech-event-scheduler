/**
 * Drizzle ORM ベースの Database Adapter 実装
 *
 * D1/libSQL 両方で動作する共通実装
 */

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { SQLiteTable, SQLiteInsertValue, SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";
import type {
  DatabaseAdapter,
  Schema,
  WhereCondition,
  OrderByCondition,
  SelectBuilder,
  QueryResult,
  QueryResults,
} from "./types";

/**
 * Drizzle インスタンスの型（D1/libSQL共通）
 */
export type DrizzleInstance =
  | DrizzleD1Database<Schema>
  | LibSQLDatabase<Schema>;

/**
 * Drizzle ORM を使用した DatabaseAdapter 実装
 */
export class DrizzleAdapter implements DatabaseAdapter {
  constructor(private readonly drizzle: DrizzleInstance) {}

  select<T extends SQLiteTable>(table: T) {
    const drizzle = this.drizzle;

    return {
      where(condition: WhereCondition): SelectBuilder<T["$inferSelect"]> {
        const query = drizzle.select().from(table).where(condition);
        return {
          async get(): Promise<QueryResult<T["$inferSelect"]>> {
            return (await query.get()) as QueryResult<T["$inferSelect"]>;
          },
          async all(): Promise<QueryResults<T["$inferSelect"]>> {
            return (await query.all()) as QueryResults<T["$inferSelect"]>;
          },
        };
      },
      orderBy(...columns: OrderByCondition[]) {
        const orderedQuery = drizzle.select().from(table).orderBy(...columns);
        return {
          where(condition: WhereCondition): SelectBuilder<T["$inferSelect"]> {
            const query = orderedQuery.where(condition);
            return {
              async get(): Promise<QueryResult<T["$inferSelect"]>> {
                return (await query.get()) as QueryResult<T["$inferSelect"]>;
              },
              async all(): Promise<QueryResults<T["$inferSelect"]>> {
                return (await query.all()) as QueryResults<T["$inferSelect"]>;
              },
            };
          },
          async all(): Promise<QueryResults<T["$inferSelect"]>> {
            return (await orderedQuery.all()) as QueryResults<T["$inferSelect"]>;
          },
        };
      },
      async all(): Promise<QueryResults<T["$inferSelect"]>> {
        return (await drizzle.select().from(table).all()) as QueryResults<
          T["$inferSelect"]
        >;
      },
    };
  }

  async insert<T extends SQLiteTable>(
    table: T,
    values: SQLiteInsertValue<T>
  ): Promise<void> {
    await this.drizzle.insert(table).values(values);
  }

  async update<T extends SQLiteTable>(
    table: T,
    values: SQLiteUpdateSetSource<T>,
    condition: WhereCondition
  ): Promise<void> {
    await this.drizzle.update(table).set(values).where(condition);
  }

  async delete<T extends SQLiteTable>(
    table: T,
    condition: WhereCondition
  ): Promise<void> {
    await this.drizzle.delete(table).where(condition);
  }

  async transaction<R>(fn: (tx: DatabaseAdapter) => Promise<R>): Promise<R> {
    return this.drizzle.transaction(async (tx) => {
      const txAdapter = new DrizzleAdapter(tx as unknown as DrizzleInstance);
      return fn(txAdapter);
    });
  }
}
