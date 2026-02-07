/**
 * 共有型定義 - パッケージ間で共有される型
 */

// ブランド型とID
export * from "./branded";

// Result型
export * from "./result";

// API型
export * from "./api";

// 列挙型
export * from "./enums";

// 日時型
export * from "./datetime";

// === エンティティ型（DBスキーマから派生させるためのベース型） ===

import type {
  EventId,
  UserId,
  OwnerId,
  ArticleId,
  SpeakerId,
  TimerId,
} from "./branded";
import type { OwnerRole } from "./enums";

/**
 * ベースエンティティ型 - すべてのエンティティが持つ共通フィールド
 */
export interface BaseEntity {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * ユーザーエンティティ型
 */
export interface User extends BaseEntity {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
}

/**
 * イベントエンティティ型
 */
export interface Event extends BaseEntity {
  readonly id: EventId;
  readonly title: string;
  readonly eventUrl: string | null;
  readonly attendance: number;
}

/**
 * オーナーエンティティ型
 */
export interface Owner extends BaseEntity {
  readonly id: OwnerId;
  readonly userId: UserId;
  readonly eventId: EventId;
  readonly role: OwnerRole;
}

/**
 * 記事エンティティ型
 */
export interface Article extends BaseEntity {
  readonly id: ArticleId;
  readonly title: string;
  readonly description: string | null;
  readonly url: string | null;
}

/**
 * スピーカーエンティティ型
 */
export interface Speaker extends BaseEntity {
  readonly id: SpeakerId;
  readonly userId: UserId;
  readonly eventId: EventId;
  readonly articleId: ArticleId | null;
  readonly role: string | null;
}

/**
 * タイマーエンティティ型
 */
export interface Timer extends BaseEntity {
  readonly id: TimerId;
  readonly eventId: EventId;
  readonly durationMinutes: number;
  readonly sequence: number;
}

// === DTO型（APIリクエスト/レスポンス用） ===
// 日時フィールドはすべてISO8601 UTC形式 (例: "2025-03-15T00:00:00.000Z")

import type { ISO8601String } from "./datetime";

/**
 * イベント作成リクエスト
 */
export interface CreateEventInput {
  readonly title: string;
  readonly eventUrl?: string;
}

/**
 * イベント更新リクエスト
 */
export interface UpdateEventInput {
  readonly title?: string;
  readonly eventUrl?: string | null;
  readonly attendance?: number;
}

/**
 * イベントレスポンス（フロントエンド向け）
 * 日時フィールドはISO8601 UTC形式
 */
export interface EventResponse {
  readonly id: number;
  readonly title: string;
  readonly eventUrl: string | null;
  readonly attendance: number;
  /** ISO8601 UTC形式 */
  readonly createdAt: ISO8601String;
  /** ISO8601 UTC形式 */
  readonly updatedAt: ISO8601String;
}

/**
 * ユーザーレスポンス（公開情報のみ）
 */
export interface UserPublicResponse {
  readonly id: string;
  readonly name: string;
  readonly image: string | null;
}

/**
 * ユーザーレスポンス（自分の情報）
 */
export interface UserResponse extends UserPublicResponse {
  readonly email: string;
  readonly emailVerified: boolean;
  /** ISO8601 UTC形式 */
  readonly createdAt: ISO8601String;
  /** ISO8601 UTC形式 */
  readonly updatedAt: ISO8601String;
}
