/**
 * @tech-event-scheduler/db
 *
 * データベース設定、スキーマ、リポジトリ
 *
 * ## アーキテクチャ
 *
 * ```
 * Consumer (API Routes)
 *     ↓
 * Repositories (EventRepository, UserRepository, etc.)
 *     ↓
 * DatabaseAdapter (抽象インターフェース)
 *     ↓
 * 具体的な Adapter (D1Adapter, LibSQLAdapter)
 *     ↓
 * Drizzle ORM
 *     ↓
 * Database (D1, libSQL)
 * ```
 *
 * ## 使用方法
 *
 * ```ts
 * import {
 *   createDatabaseAdapter,
 *   createRepositories,
 *   type EventRepository,
 * } from "@tech-event-scheduler/db";
 *
 * // Adapter を作成（環境に応じて D1 または libSQL を使用）
 * const adapter = createDatabaseAdapter(env);
 *
 * // リポジトリを作成
 * const { events, users } = createRepositories(adapter);
 *
 * // リポジトリを使用
 * const event = await events.findById(id);
 * ```
 */

// === Adapters ===
export {
  createDatabaseAdapter,
  createD1Adapter,
  createLibSQLAdapter,
  type DatabaseAdapter,
  type DatabaseEnv,
  type LibSQLOptions,
} from "./adapters";

// === Repositories ===
export {
  createRepositories,
  createUnitOfWork,
  createEventRepository,
  createEventParticipantRepository,
  createUserRepository,
  type Repositories,
  type UnitOfWork,
  type EventRepository,
  type EventParticipantRepository,
  type UserRepository,
  type EventSearchCriteria,
  type PaginationOptions,
  type EventWithOrganizer,
  type ParticipantWithUser,
} from "./repositories";

// === Schema ===
export * from "./schema";

// 後方互換性のための型エイリアス（非推奨、将来削除予定）

import { createDatabaseAdapter, type DatabaseEnv } from "./adapters";
import { createRepositories } from "./repositories";

/**
 * @deprecated Use createDatabaseAdapter and createRepositories instead
 *
 * 後方互換性のためのヘルパー関数
 * 新規コードでは createDatabaseAdapter + createRepositories を使用してください
 */
export function createDatabase(env: DatabaseEnv) {
  const adapter = createDatabaseAdapter(env);
  return {
    adapter,
    ...createRepositories(adapter),
  };
}

/**
 * @deprecated Use Repositories type instead
 */
export type Database = ReturnType<typeof createDatabase>;
