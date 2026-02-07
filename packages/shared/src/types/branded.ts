/**
 * Branded Types - 型安全なID管理のためのユーティリティ
 *
 * Branded types を使用することで、同じ基底型（string）でも
 * 異なる意味を持つIDを型レベルで区別できます。
 */

declare const brand: unique symbol;

/**
 * ブランド型を作成するためのユーティリティ型
 * @example
 * type UserId = Brand<string, 'UserId'>;
 * type EventId = Brand<string, 'EventId'>;
 */
export type Brand<T, TBrand extends string> = T & {
  readonly [brand]: TBrand;
};

/**
 * ブランド型からブランドを除去するユーティリティ型
 */
export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;

// === エンティティID型 ===

export type UserId = Brand<string, "UserId">;
export type EventId = Brand<number, "EventId">;
export type OwnerId = Brand<number, "OwnerId">;
export type ArticleId = Brand<number, "ArticleId">;
export type SpeakerId = Brand<number, "SpeakerId">;
export type TimerId = Brand<number, "TimerId">;
export type SessionId = Brand<string, "SessionId">;
export type AccountId = Brand<string, "AccountId">;
export type VerificationId = Brand<string, "VerificationId">;

// === ID作成関数 ===

/**
 * UUIDを生成し、指定されたブランド型として返す
 */
export function createId<T extends Brand<string, string>>(): T {
  return crypto.randomUUID() as T;
}

/**
 * 既存の文字列をブランド型に変換（バリデーション付き）
 */
export function parseId<T extends Brand<string, string>>(
  id: string,
  _brandName?: string
): T {
  if (!isValidUUID(id)) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  return id as T;
}

/**
 * 既存の文字列をブランド型に安全に変換（バリデーションなし - 信頼できるソース用）
 */
export function unsafeParseId<T extends Brand<string, string>>(id: string): T {
  return id as T;
}

/**
 * UUID形式の検証
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// === 型ガード ===

export function isUserId(id: string): id is UserId {
  return isValidUUID(id);
}

export function isEventId(id: number): id is EventId {
  return Number.isInteger(id) && id > 0;
}
