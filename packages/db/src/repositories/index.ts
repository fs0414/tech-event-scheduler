export type { PaginationOptions, Database } from "./common";
export type { EventRepository, EventSearchCriteria } from "./event.repository";
export type { OwnerRepository, OwnerWithUser } from "./owner.repository";
export type { ArticleRepository } from "./article.repository";
export type { SpeakerRepository, SpeakerWithDetails } from "./speaker.repository";
export type { TimerRepository } from "./timer.repository";
export type { UserRepository } from "./user.repository";

export { createEventRepository } from "./event.repository";
export { createOwnerRepository } from "./owner.repository";
export { createArticleRepository } from "./article.repository";
export { createSpeakerRepository } from "./speaker.repository";
export { createTimerRepository } from "./timer.repository";
export { createUserRepository } from "./user.repository";

import type { Database } from "./common";
import { createEventRepository } from "./event.repository";
import { createOwnerRepository } from "./owner.repository";
import { createArticleRepository } from "./article.repository";
import { createSpeakerRepository } from "./speaker.repository";
import { createTimerRepository } from "./timer.repository";
import { createUserRepository } from "./user.repository";
import type { EventRepository } from "./event.repository";
import type { OwnerRepository } from "./owner.repository";
import type { ArticleRepository } from "./article.repository";
import type { SpeakerRepository } from "./speaker.repository";
import type { TimerRepository } from "./timer.repository";
import type { UserRepository } from "./user.repository";

export interface Repositories {
  readonly events: EventRepository;
  readonly owners: OwnerRepository;
  readonly articles: ArticleRepository;
  readonly speakers: SpeakerRepository;
  readonly timers: TimerRepository;
  readonly users: UserRepository;
}

export function createRepositories(db: Database): Repositories {
  return {
    events: createEventRepository(db),
    owners: createOwnerRepository(db),
    articles: createArticleRepository(db),
    speakers: createSpeakerRepository(db),
    timers: createTimerRepository(db),
    users: createUserRepository(db),
  };
}
