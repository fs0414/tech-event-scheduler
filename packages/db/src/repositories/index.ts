/**
 * Repositories
 *
 * データアクセス層の公開API
 */

// インターフェース
export type {
  EventRepository,
  OwnerRepository,
  ArticleRepository,
  SpeakerRepository,
  TimerRepository,
  UserRepository,
  Repositories,
  UnitOfWork,
  EventSearchCriteria,
  PaginationOptions,
  OwnerWithUser,
  SpeakerWithDetails,
} from "./types";

// ファクトリ関数
export { createEventRepository } from "./event.repository";
export { createOwnerRepository } from "./owner.repository";
export { createArticleRepository } from "./article.repository";
export { createSpeakerRepository } from "./speaker.repository";
export { createTimerRepository } from "./timer.repository";
export { createUserRepository } from "./user.repository";

import type { DatabaseAdapter } from "../adapters/types";
import { createEventRepository } from "./event.repository";
import { createOwnerRepository } from "./owner.repository";
import { createArticleRepository } from "./article.repository";
import { createSpeakerRepository } from "./speaker.repository";
import { createTimerRepository } from "./timer.repository";
import { createUserRepository } from "./user.repository";
import type { Repositories, UnitOfWork } from "./types";

/**
 * 全リポジトリを作成
 */
export function createRepositories(adapter: DatabaseAdapter): Repositories {
  return {
    events: createEventRepository(adapter),
    owners: createOwnerRepository(adapter),
    articles: createArticleRepository(adapter),
    speakers: createSpeakerRepository(adapter),
    timers: createTimerRepository(adapter),
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
