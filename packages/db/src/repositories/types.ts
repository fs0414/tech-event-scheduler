/**
 * Repository インターフェース定義
 *
 * データアクセスを抽象化し、ビジネスロジックからDB詳細を隠蔽
 */

import type {
  Event,
  NewEvent,
  UpdateEvent,
  Owner,
  NewOwner,
  UpdateOwner,
  Article,
  NewArticle,
  UpdateArticle,
  Speaker,
  NewSpeaker,
  UpdateSpeaker,
  Timer,
  NewTimer,
  UpdateTimer,
  User,
} from "../schema";

/**
 * オーナーとユーザー情報
 */
export interface OwnerWithUser extends Owner {
  readonly user: User;
}

/**
 * スピーカーとユーザー・記事情報
 */
export interface SpeakerWithDetails extends Speaker {
  readonly user: User;
  readonly article?: Article;
}

/**
 * イベント検索条件
 */
export interface EventSearchCriteria {
  /** タイトル部分一致 */
  readonly titleContains?: string;
}

/**
 * ページネーションオプション
 */
export interface PaginationOptions {
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Event Repository インターフェース
 */
export interface EventRepository {
  findById(id: number): Promise<Event | undefined>;
  findAll(options?: PaginationOptions): Promise<readonly Event[]>;
  findByCriteria(
    criteria: EventSearchCriteria,
    options?: PaginationOptions
  ): Promise<readonly Event[]>;
  findByOwnerId(
    userId: string,
    options?: PaginationOptions
  ): Promise<readonly Event[]>;
  create(data: NewEvent): Promise<Event>;
  update(id: number, data: UpdateEvent): Promise<Event | undefined>;
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
}

/**
 * Owner Repository インターフェース
 */
export interface OwnerRepository {
  findById(id: number): Promise<Owner | undefined>;
  findByEventId(eventId: number): Promise<readonly Owner[]>;
  findByUserId(userId: string): Promise<readonly Owner[]>;
  findByEventAndUser(
    eventId: number,
    userId: string
  ): Promise<Owner | undefined>;
  create(data: NewOwner): Promise<Owner>;
  update(id: number, data: UpdateOwner): Promise<Owner | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByEventId(eventId: number): Promise<number>;
}

/**
 * Article Repository インターフェース
 */
export interface ArticleRepository {
  findById(id: number): Promise<Article | undefined>;
  findAll(options?: PaginationOptions): Promise<readonly Article[]>;
  create(data: NewArticle): Promise<Article>;
  update(id: number, data: UpdateArticle): Promise<Article | undefined>;
  delete(id: number): Promise<boolean>;
}

/**
 * Speaker Repository インターフェース
 */
export interface SpeakerRepository {
  findById(id: number): Promise<Speaker | undefined>;
  findByEventId(eventId: number): Promise<readonly Speaker[]>;
  findByUserId(userId: string): Promise<readonly Speaker[]>;
  findByEventAndUser(
    eventId: number,
    userId: string
  ): Promise<Speaker | undefined>;
  create(data: NewSpeaker): Promise<Speaker>;
  update(id: number, data: UpdateSpeaker): Promise<Speaker | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByEventId(eventId: number): Promise<number>;
}

/**
 * Timer Repository インターフェース
 */
export interface TimerRepository {
  findById(id: number): Promise<Timer | undefined>;
  findByEventId(eventId: number): Promise<readonly Timer[]>;
  create(data: NewTimer): Promise<Timer>;
  update(id: number, data: UpdateTimer): Promise<Timer | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByEventId(eventId: number): Promise<number>;
  reorder(eventId: number, timerIds: number[]): Promise<void>;
}

/**
 * User Repository インターフェース
 */
export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  exists(id: string): Promise<boolean>;
}

/**
 * Unit of Work パターン
 */
export interface UnitOfWork {
  transaction<R>(fn: (repos: Repositories) => Promise<R>): Promise<R>;
}

/**
 * 全リポジトリへのアクセス
 */
export interface Repositories {
  readonly events: EventRepository;
  readonly owners: OwnerRepository;
  readonly articles: ArticleRepository;
  readonly speakers: SpeakerRepository;
  readonly timers: TimerRepository;
  readonly users: UserRepository;
}
