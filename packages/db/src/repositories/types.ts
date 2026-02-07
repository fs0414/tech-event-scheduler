/**
 * Repository インターフェース定義
 *
 * データアクセスを抽象化し、ビジネスロジックからDB詳細を隠蔽
 */

import type {
  Event,
  NewEvent,
  UpdateEvent,
  EventParticipant,
  NewEventParticipant,
  UpdateEventParticipant,
  User,
} from "../schema";

/**
 * イベントと主催者情報
 */
export interface EventWithOrganizer extends Event {
  readonly organizer: User;
}

/**
 * 参加者とユーザー情報
 */
export interface ParticipantWithUser extends EventParticipant {
  readonly user: User;
}

/**
 * イベント検索条件
 */
export interface EventSearchCriteria {
  /** 主催者ID */
  readonly organizerId?: string;
  /** 開始日以降 */
  readonly startDateFrom?: Date;
  /** 開始日以前 */
  readonly startDateTo?: Date;
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
  /**
   * IDでイベントを取得
   */
  findById(id: string): Promise<Event | undefined>;

  /**
   * 全イベントを取得
   */
  findAll(options?: PaginationOptions): Promise<readonly Event[]>;

  /**
   * 条件でイベントを検索
   */
  findByCriteria(
    criteria: EventSearchCriteria,
    options?: PaginationOptions
  ): Promise<readonly Event[]>;

  /**
   * 主催者IDでイベントを取得
   */
  findByOrganizerId(
    organizerId: string,
    options?: PaginationOptions
  ): Promise<readonly Event[]>;

  /**
   * イベントを作成
   */
  create(data: NewEvent): Promise<Event>;

  /**
   * イベントを更新
   */
  update(id: string, data: UpdateEvent): Promise<Event | undefined>;

  /**
   * イベントを削除
   */
  delete(id: string): Promise<boolean>;

  /**
   * イベントの存在確認
   */
  exists(id: string): Promise<boolean>;
}

/**
 * Event Participant Repository インターフェース
 */
export interface EventParticipantRepository {
  /**
   * IDで参加者を取得
   */
  findById(id: string): Promise<EventParticipant | undefined>;

  /**
   * イベントIDで参加者一覧を取得
   */
  findByEventId(eventId: string): Promise<readonly EventParticipant[]>;

  /**
   * ユーザーIDで参加イベント一覧を取得
   */
  findByUserId(userId: string): Promise<readonly EventParticipant[]>;

  /**
   * イベントIDとユーザーIDで参加者を取得
   */
  findByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<EventParticipant | undefined>;

  /**
   * 参加者を作成
   */
  create(data: NewEventParticipant): Promise<EventParticipant>;

  /**
   * 参加ステータスを更新
   */
  updateStatus(
    id: string,
    data: UpdateEventParticipant
  ): Promise<EventParticipant | undefined>;

  /**
   * 参加者を削除
   */
  delete(id: string): Promise<boolean>;

  /**
   * イベントの全参加者を削除
   */
  deleteByEventId(eventId: string): Promise<number>;
}

/**
 * User Repository インターフェース
 */
export interface UserRepository {
  /**
   * IDでユーザーを取得
   */
  findById(id: string): Promise<User | undefined>;

  /**
   * メールアドレスでユーザーを取得
   */
  findByEmail(email: string): Promise<User | undefined>;

  /**
   * ユーザーの存在確認
   */
  exists(id: string): Promise<boolean>;
}

/**
 * Unit of Work パターン
 *
 * トランザクション境界を管理
 */
export interface UnitOfWork {
  /**
   * トランザクション内で処理を実行
   */
  transaction<R>(fn: (uow: Repositories) => Promise<R>): Promise<R>;
}

/**
 * 全リポジトリへのアクセス
 */
export interface Repositories {
  readonly events: EventRepository;
  readonly eventParticipants: EventParticipantRepository;
  readonly users: UserRepository;
}
