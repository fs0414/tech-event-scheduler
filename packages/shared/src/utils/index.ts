/**
 * ユーティリティ関数
 */

import type { UserId, Brand } from "../types/branded";
import { createId } from "../types/branded";
import { toISO8601 } from "../types/datetime";
import type { EventResponse } from "../types";

// === 日付フォーマット ===

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

export function formatDateTime(date: Date): string {
  return date.toISOString();
}

export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

// === バリデーション ===

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// === ID生成（後方互換性のため残す） ===

/**
 * @deprecated createId<UserId>() を使用してください
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 型付きID生成関数
 */
export function generateUserId(): UserId {
  return createId<UserId>();
}

// === オブジェクトユーティリティ ===

/**
 * オブジェクトからundefinedの値を持つキーを除去
 */
export function omitUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

/**
 * Pick型のランタイム版
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Pick<T, K>
  );
}

/**
 * Omit型のランタイム版
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const keysSet = new Set(keys as readonly (keyof T)[]);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysSet.has(key as keyof T))
  ) as Omit<T, K>;
}

// === 型変換ユーティリティ ===

/**
 * エンティティをレスポンス型に変換（日付をISO文字列に）
 */
export function toResponse<T extends { createdAt: Date; updatedAt: Date }>(
  entity: T
): Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

/**
 * イベントエンティティをEventResponse型に変換
 * 日時フィールドはISO8601 UTC形式に変換
 */
export function eventToResponse(event: {
  id: number | Brand<number, string>;
  title: string;
  eventUrl: string | null;
  attendance: number;
  createdAt: Date;
  updatedAt: Date;
}): EventResponse {
  return {
    id: event.id as number,
    title: event.title,
    eventUrl: event.eventUrl,
    attendance: event.attendance,
    createdAt: toISO8601(event.createdAt),
    updatedAt: toISO8601(event.updatedAt),
  };
}

// === Exhaustive Check ===

/**
 * switch文の網羅性チェック用
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
