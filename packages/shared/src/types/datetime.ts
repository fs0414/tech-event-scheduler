/**
 * 日時型定義とユーティリティ
 *
 * 設計原則:
 * - DB: Unix timestamp (integer, 秒単位, UTC)
 * - API: ISO8601 UTC文字列 (例: "2025-03-15T00:00:00.000Z")
 * - 表示: JST (Asia/Tokyo) に変換
 */

// === Branded Types ===

declare const ISO8601Brand: unique symbol;
declare const UnixTimestampBrand: unique symbol;

/**
 * ISO8601形式のUTC日時文字列
 * @example "2025-03-15T00:00:00.000Z"
 */
export type ISO8601String = string & { readonly [ISO8601Brand]: never };

/**
 * Unix timestamp (秒単位, UTC)
 * @example 1710460800
 */
export type UnixTimestamp = number & { readonly [UnixTimestampBrand]: never };

// === 定数 ===

/** 日本標準時のタイムゾーン */
export const JST_TIMEZONE = "Asia/Tokyo" as const;

/** UTCタイムゾーン */
export const UTC_TIMEZONE = "UTC" as const;

/** JSTとUTCの差分（ミリ秒） */
export const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

// === 変換関数 ===

/**
 * DateをUnix timestamp (秒) に変換
 */
export function toUnixTimestamp(date: Date): UnixTimestamp {
  return Math.floor(date.getTime() / 1000) as UnixTimestamp;
}

/**
 * Unix timestamp (秒) をDateに変換
 */
export function fromUnixTimestamp(timestamp: UnixTimestamp): Date {
  return new Date(timestamp * 1000);
}

/**
 * DateをISO8601 UTC文字列に変換
 */
export function toISO8601(date: Date): ISO8601String {
  return date.toISOString() as ISO8601String;
}

/**
 * ISO8601文字列をDateに変換
 */
export function fromISO8601(iso: ISO8601String): Date {
  return new Date(iso);
}

/**
 * 文字列がISO8601形式かチェック
 */
export function isISO8601(value: string): value is ISO8601String {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (!iso8601Regex.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

/**
 * 文字列をISO8601として解析（バリデーション付き）
 */
export function parseISO8601(value: string): ISO8601String {
  if (!isISO8601(value)) {
    throw new Error(`Invalid ISO8601 string: ${value}`);
  }
  return value;
}

// === 表示用フォーマット (JST) ===

/**
 * DateをJSTの日付文字列に変換
 * @example "2025年3月15日"
 */
export function formatDateJST(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    timeZone: JST_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * DateをJSTの短い日付文字列に変換
 * @example "2025/03/15"
 */
export function formatDateShortJST(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    timeZone: JST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * DateをJSTの日時文字列に変換
 * @example "2025年3月15日 14:30"
 */
export function formatDateTimeJST(date: Date): string {
  return date.toLocaleString("ja-JP", {
    timeZone: JST_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * DateをJSTの時刻文字列に変換
 * @example "14:30"
 */
export function formatTimeJST(date: Date): string {
  return date.toLocaleTimeString("ja-JP", {
    timeZone: JST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 日付範囲をJSTでフォーマット
 * @example "2025年3月15日 - 3月16日" or "2025年3月15日"
 */
export function formatDateRangeJST(startDate: Date, endDate: Date): string {
  const start = formatDateJST(startDate);
  const end = formatDateJST(endDate);

  if (start === end) {
    return start;
  }

  // 同じ年の場合は終了日の年を省略
  const startYear = startDate.toLocaleDateString("ja-JP", {
    timeZone: JST_TIMEZONE,
    year: "numeric",
  });
  const endYear = endDate.toLocaleDateString("ja-JP", {
    timeZone: JST_TIMEZONE,
    year: "numeric",
  });

  if (startYear === endYear) {
    const endWithoutYear = endDate.toLocaleDateString("ja-JP", {
      timeZone: JST_TIMEZONE,
      month: "long",
      day: "numeric",
    });
    return `${start} - ${endWithoutYear}`;
  }

  return `${start} - ${end}`;
}

// === 相対時間 ===

/**
 * 相対時間を取得
 * @example "3日後", "2時間前"
 */
export function getRelativeTime(date: Date, baseDate: Date = new Date()): string {
  const diffMs = date.getTime() - baseDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const isFuture = diffMs > 0;
  const suffix = isFuture ? "後" : "前";
  const abs = Math.abs;

  if (abs(diffDay) >= 1) {
    return `${abs(diffDay)}日${suffix}`;
  }
  if (abs(diffHour) >= 1) {
    return `${abs(diffHour)}時間${suffix}`;
  }
  if (abs(diffMin) >= 1) {
    return `${abs(diffMin)}分${suffix}`;
  }
  return "たった今";
}

// === 比較・判定 ===

/**
 * 日付が過去かどうか
 */
export function isPast(date: Date, now: Date = new Date()): boolean {
  return date.getTime() < now.getTime();
}

/**
 * 日付が未来かどうか
 */
export function isFuture(date: Date, now: Date = new Date()): boolean {
  return date.getTime() > now.getTime();
}

/**
 * 日付が今日かどうか (JST基準)
 */
export function isToday(date: Date, now: Date = new Date()): boolean {
  return formatDateShortJST(date) === formatDateShortJST(now);
}

/**
 * 期間内かどうか
 */
export function isWithinRange(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  const time = date.getTime();
  return time >= startDate.getTime() && time <= endDate.getTime();
}

/**
 * イベントが開催中かどうか
 */
export function isOngoing(
  startDate: Date,
  endDate: Date,
  now: Date = new Date()
): boolean {
  return isWithinRange(now, startDate, endDate);
}
