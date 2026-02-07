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
  // テーブル
  event,
  owner,
  article,
  speaker,
  timer,
  // 定数
  OWNER_ROLES,
  // 型
  type OwnerRole,
  type Event,
  type NewEvent,
  type UpdateEvent,
  type Owner,
  type NewOwner,
  type UpdateOwner,
  type Article,
  type NewArticle,
  type UpdateArticle,
  type Speaker,
  type NewSpeaker,
  type UpdateSpeaker,
  type Timer,
  type NewTimer,
  type UpdateTimer,
} from "./events";
