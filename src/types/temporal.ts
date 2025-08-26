import { Temporal } from 'temporal-polyfill';

// Temporal型のエイリアス
export type PlainDateTime = Temporal.PlainDateTime;
export type ZonedDateTime = Temporal.ZonedDateTime;
export type Instant = Temporal.Instant;
export type Duration = Temporal.Duration;

// データベースのタイムスタンプを表す型
export interface TimestampFields {
  createdAt: PlainDateTime;
  updatedAt: PlainDateTime;
}

// Prismaのレスポンスを表す型（従来のDate型との互換性のため）
export interface PrismaTimestampFields {
  createdAt: Date;
  updatedAt: Date;
}

// 日時フォーマットオプション
export interface DateTimeFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  format?: 'full' | 'short' | 'medium';
}

// タイムゾーン設定
export type TimeZone = string;

// 日時の範囲を表す型
export interface TimeRange {
  start: PlainDateTime | ZonedDateTime;
  end: PlainDateTime | ZonedDateTime;
}

// イベント用の拡張タイムスタンプ型
export interface EventTimestamps extends TimestampFields {
  eventDate?: PlainDateTime;
  startTime?: PlainDateTime;
  endTime?: PlainDateTime;
}

// ユーザー用の拡張タイムスタンプ型
export interface UserTimestamps extends TimestampFields {
  lastLoginAt?: PlainDateTime;
  emailVerifiedAt?: PlainDateTime;
}

// Timer用のタイムスタンプ型
export interface TimerTimestamps extends TimestampFields {
  startedAt?: PlainDateTime;
  pausedAt?: PlainDateTime;
  completedAt?: PlainDateTime;
}