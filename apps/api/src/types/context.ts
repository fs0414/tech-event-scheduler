/**
 * Elysia コンテキスト型定義
 */

import type { Repositories } from "@tech-event-scheduler/db";
import type { Auth } from "../auth";

/**
 * アプリケーションコンテキスト
 */
export interface AppContext {
  readonly repositories: Repositories;
  readonly auth: Auth;
}

/**
 * 認証済みセッション情報
 */
export interface AuthenticatedSession {
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly image: string | null;
    readonly emailVerified: boolean;
  };
  readonly session: {
    readonly id: string;
    readonly expiresAt: Date;
  };
}
