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

import type { EventId, UserId, EventParticipantId } from "./branded";
import type { ParticipantStatus } from "./enums";

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
  readonly description: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly location: string | null;
  readonly url: string | null;
  readonly organizerId: UserId;
}

/**
 * イベント参加者エンティティ型
 */
export interface EventParticipant extends BaseEntity {
  readonly id: EventParticipantId;
  readonly eventId: EventId;
  readonly userId: UserId;
  readonly status: ParticipantStatus;
}

// === DTO型（APIリクエスト/レスポンス用） ===
// 日時フィールドはすべてISO8601 UTC形式 (例: "2025-03-15T00:00:00.000Z")

import type { ISO8601String } from "./datetime";

/**
 * イベント作成リクエスト
 */
export interface CreateEventInput {
  readonly title: string;
  readonly description: string;
  /** ISO8601 UTC形式 */
  readonly startDate: ISO8601String;
  /** ISO8601 UTC形式 */
  readonly endDate: ISO8601String;
  readonly location?: string;
  readonly url?: string;
  readonly organizerId: string;
}

/**
 * イベント更新リクエスト
 */
export interface UpdateEventInput {
  readonly title?: string;
  readonly description?: string;
  /** ISO8601 UTC形式 */
  readonly startDate?: ISO8601String;
  /** ISO8601 UTC形式 */
  readonly endDate?: ISO8601String;
  readonly location?: string | null;
  readonly url?: string | null;
}

/**
 * イベント参加登録リクエスト
 */
export interface RegisterParticipantInput {
  readonly eventId: string;
  readonly userId: string;
}

/**
 * イベントレスポンス（フロントエンド向け）
 * 日時フィールドはISO8601 UTC形式
 */
export interface EventResponse {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** ISO8601 UTC形式 */
  readonly startDate: ISO8601String;
  /** ISO8601 UTC形式 */
  readonly endDate: ISO8601String;
  readonly location: string | null;
  readonly url: string | null;
  readonly organizerId: string;
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
