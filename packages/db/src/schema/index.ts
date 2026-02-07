/**
 * DBスキーマ - Drizzle ORMテーブル定義とInfer型
 */

// 認証関連
export {
  user,
  session,
  account,
  verification,
  type User,
  type NewUser,
  type Session,
  type NewSession,
  type Account,
  type NewAccount,
  type Verification,
  type NewVerification,
} from "./auth";

// イベント関連
export {
  event,
  eventParticipant,
  PARTICIPANT_STATUSES,
  type ParticipantStatusDB,
  type Event,
  type NewEvent,
  type UpdateEvent,
  type EventParticipant,
  type NewEventParticipant,
  type UpdateEventParticipant,
} from "./events";
