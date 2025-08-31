import { dateToPlainDateTime } from "./temporal";

/**
 * Dateオブジェクトをtemporal-polyfillのPlainDateTimeに変換する
 * 個別のフィールドやオブジェクトに対して明示的に使用する
 */
export function convertDateToTemporal(date: Date) {
  return dateToPlainDateTime(date);
}

/**
 * オブジェクトのcreatedAt, updatedAtフィールドをTemporal形式に変換
 * 使用例: const converted = convertTimestamps(user);
 */
export function convertTimestamps<
  T extends { createdAt?: Date; updatedAt?: Date },
>(obj: T) {
  return {
    ...obj,
    ...(obj.createdAt && { createdAt: dateToPlainDateTime(obj.createdAt) }),
    ...(obj.updatedAt && { updatedAt: dateToPlainDateTime(obj.updatedAt) }),
  };
}
