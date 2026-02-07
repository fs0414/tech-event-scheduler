/**
 * Repositories
 *
 * データアクセス層の公開API
 */

// インターフェース
export type {
  EventRepository,
  EventParticipantRepository,
  UserRepository,
  Repositories,
  UnitOfWork,
  EventSearchCriteria,
  PaginationOptions,
  EventWithOrganizer,
  ParticipantWithUser,
} from "./types";

// ファクトリ関数
export { createEventRepository } from "./event.repository";
export { createEventParticipantRepository } from "./event-participant.repository";
export { createUserRepository } from "./user.repository";

import type { DatabaseAdapter } from "../adapters/types";
import { createEventRepository } from "./event.repository";
import { createEventParticipantRepository } from "./event-participant.repository";
import { createUserRepository } from "./user.repository";
import type { Repositories, UnitOfWork } from "./types";

/**
 * 全リポジトリを作成
 */
export function createRepositories(adapter: DatabaseAdapter): Repositories {
  return {
    events: createEventRepository(adapter),
    eventParticipants: createEventParticipantRepository(adapter),
    users: createUserRepository(adapter),
  };
}

/**
 * Unit of Work を作成
 */
export function createUnitOfWork(adapter: DatabaseAdapter): UnitOfWork {
  return {
    async transaction<R>(fn: (repos: Repositories) => Promise<R>): Promise<R> {
      return adapter.transaction(async (txAdapter) => {
        const repos = createRepositories(txAdapter);
        return fn(repos);
      });
    },
  };
}
