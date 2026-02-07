/**
 * 列挙型定義 - 型安全なステータスや種別の管理
 */

// === イベント参加ステータス ===

export const PARTICIPANT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
} as const;

export type ParticipantStatus =
  (typeof PARTICIPANT_STATUS)[keyof typeof PARTICIPANT_STATUS];

export const PARTICIPANT_STATUS_VALUES = Object.values(
  PARTICIPANT_STATUS
) as readonly ParticipantStatus[];

// === イベントステータス ===

export const EVENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const EVENT_STATUS_VALUES = Object.values(
  EVENT_STATUS
) as readonly EventStatus[];

// === 認証プロバイダー ===

export const AUTH_PROVIDER = {
  EMAIL: "email",
  GOOGLE: "google",
  GITHUB: "github",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

// === 型ガード ===

export function isParticipantStatus(
  value: string
): value is ParticipantStatus {
  return PARTICIPANT_STATUS_VALUES.includes(value as ParticipantStatus);
}

export function isEventStatus(value: string): value is EventStatus {
  return EVENT_STATUS_VALUES.includes(value as EventStatus);
}
