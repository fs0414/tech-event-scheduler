import { Temporal } from 'temporal-polyfill';

// Temporal Polyfillの初期化
// Next.jsでの使用を考慮してサーバーサイドとクライアントサイド両方で動作するように設定

/**
 * 現在の日時を取得（UTC）
 */
export function now(): Temporal.PlainDateTime {
  return Temporal.Now.plainDateTimeISO('UTC');
}

/**
 * 現在の日時を取得（指定タイムゾーン）
 */
export function nowInTimeZone(timeZone: string = 'Asia/Tokyo'): Temporal.ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO(timeZone);
}

/**
 * DateオブジェクトをTemporal.PlainDateTimeに変換
 */
export function dateToPlainDateTime(date: Date): Temporal.PlainDateTime {
  const instant = Temporal.Instant.fromEpochMilliseconds(date.getTime());
  return instant.toZonedDateTimeISO('UTC').toPlainDateTime();
}

/**
 * Temporal.PlainDateTimeをDateオブジェクトに変換
 */
export function plainDateTimeToDate(plainDateTime: Temporal.PlainDateTime): Date {
  return new Date(plainDateTime.toZonedDateTime('UTC').epochMilliseconds);
}

/**
 * 日時のフォーマット（日本語）
 */
export function formatDateTime(
  dateTime: Temporal.PlainDateTime | Temporal.ZonedDateTime,
  options: {
    includeTime?: boolean;
    includeSeconds?: boolean;
    format?: 'full' | 'short' | 'medium';
  } = {}
): string {
  const { includeTime = true, includeSeconds = false, format = 'medium' } = options;

  let dt: Temporal.PlainDateTime;
  if (dateTime instanceof Temporal.ZonedDateTime) {
    dt = dateTime.toPlainDateTime();
  } else {
    dt = dateTime;
  }

  const year = dt.year;
  const month = dt.month.toString().padStart(2, '0');
  const day = dt.day.toString().padStart(2, '0');
  
  let result = '';
  
  switch (format) {
    case 'full':
      result = `${year}年${dt.month}月${dt.day}日`;
      break;
    case 'short':
      result = `${year}/${month}/${day}`;
      break;
    case 'medium':
    default:
      result = `${year}-${month}-${day}`;
      break;
  }

  if (includeTime) {
    const hour = dt.hour.toString().padStart(2, '0');
    const minute = dt.minute.toString().padStart(2, '0');
    
    if (includeSeconds) {
      const second = dt.second.toString().padStart(2, '0');
      result += ` ${hour}:${minute}:${second}`;
    } else {
      result += ` ${hour}:${minute}`;
    }
  }

  return result;
}

/**
 * タイムスタンプIDの生成（Date.now()の代替）
 */
export function generateTimestampId(): string {
  return Temporal.Now.instant().epochNanoseconds.toString();
}

/**
 * タイムスタンプIDの生成（ユーザーID用）
 */
export function generateUserTimestampId(): string {
  const instant = Temporal.Now.instant();
  const epochMillis = instant.epochMilliseconds;
  return `user-${epochMillis}`;
}

/**
 * デフォルトタイムゾーン
 */
export const DEFAULT_TIMEZONE = 'Asia/Tokyo';