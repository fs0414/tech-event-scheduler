/**
 * Eden Treaty による型安全なAPIクライアント
 */

import { treaty } from "@elysiajs/eden";
import type { App } from "@tech-event-scheduler/api";
import {
  type ApiResponse,
  type ApiError,
  type EventResponse,
  success,
  failure,
  isSuccess,
} from "@tech-event-scheduler/shared";

// === 設定 ===

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

// === Eden Treaty クライアント ===

/**
 * Eden Treaty クライアント
 * Elysia APIから自動的に型が推論される
 */
export const edenClient = treaty<App>(API_BASE_URL, {
  fetch: {
    credentials: "include",
  },
});

// === ヘルパー関数 ===

/**
 * Eden レスポンスを ApiResponse 型に変換
 * APIはすでにResult型（Success/Failure）を返すため、それをそのまま透過的に処理
 */
function toApiResponse<T>(result: {
  data: unknown;
  error: { value: unknown } | null;
}): ApiResponse<T> {
  // Edenのエラー（ネットワークエラー等）
  if (result.error) {
    const errorValue = result.error.value as { message?: string } | undefined;
    const apiError: ApiError = {
      code: "INTERNAL_ERROR",
      message: errorValue?.message ?? "リクエストに失敗しました",
    };
    return failure(apiError);
  }

  // データがない場合
  if (result.data === null || result.data === undefined) {
    return failure({
      code: "INTERNAL_ERROR",
      message: "レスポンスデータがありません",
    });
  }

  // APIがResult型（success/failure）で返す場合、そのまま返す
  const data = result.data;
  if (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    typeof (data as { success: unknown }).success === "boolean"
  ) {
    // success.dataの中身がTになるように型変換
    const resultData = data as { success: boolean; data?: unknown; error?: unknown };
    if (resultData.success && "data" in resultData) {
      return success(resultData.data as T);
    }
    if (!resultData.success && "error" in resultData) {
      return failure(resultData.error as ApiError);
    }
  }

  // 直接データが返ってくる場合（レガシー対応）
  return success(result.data as T);
}

// === イベントAPI（Eden Treaty経由） ===

export const eventsApi = {
  /**
   * イベント一覧を取得
   */
  async list(): Promise<ApiResponse<readonly EventResponse[]>> {
    const result = await edenClient.api.events.get();
    return toApiResponse<readonly EventResponse[]>(result);
  },

  /**
   * イベント詳細を取得
   */
  async get(id: string): Promise<ApiResponse<EventResponse>> {
    const result = await edenClient.api.events({ id }).get();
    return toApiResponse<EventResponse>(result);
  },

  /**
   * イベントを作成
   */
  async create(input: {
    title: string;
    eventUrl?: string;
  }): Promise<ApiResponse<EventResponse>> {
    const result = await edenClient.api.events.post(input);
    return toApiResponse<EventResponse>(result);
  },

  /**
   * イベントを更新
   */
  async update(
    id: string,
    input: { title?: string; eventUrl?: string | null; attendance?: number }
  ): Promise<ApiResponse<EventResponse>> {
    const result = await edenClient.api.events({ id }).patch(input);
    return toApiResponse<EventResponse>(result);
  },

  /**
   * イベントを削除
   */
  async delete(id: string): Promise<ApiResponse<{ deleted: true }>> {
    const result = await edenClient.api.events({ id }).delete();
    return toApiResponse<{ deleted: true }>(result);
  },
} as const;

// === ヘルスチェックAPI（Eden Treaty経由） ===

export interface HealthStatus {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  version?: string;
}

export const healthApi = {
  /**
   * ヘルスチェック
   */
  async check(): Promise<ApiResponse<HealthStatus>> {
    const result = await edenClient.health.get();
    return toApiResponse<HealthStatus>(result);
  },
} as const;

// === 認証API（Better Auth - 手動実装） ===
// Better Auth は .all() で定義されているため Eden Treaty で型推論できない

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    expiresAt: string;
  };
}

async function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    const data: unknown = await response.json();

    if (response.ok) {
      return success(data as T);
    }

    const errorData = data as { message?: string } | null;
    return failure({
      code: "INTERNAL_ERROR",
      message: errorData?.message ?? "認証リクエストに失敗しました",
    });
  } catch (error) {
    return failure({
      code: "INTERNAL_ERROR",
      message:
        error instanceof Error ? error.message : "ネットワークエラーが発生しました",
    });
  }
}

export const authApi = {
  /**
   * ログイン
   */
  async login(input: LoginInput): Promise<ApiResponse<AuthSession>> {
    return authRequest<AuthSession>("/api/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /**
   * 新規登録
   */
  async register(input: RegisterInput): Promise<ApiResponse<AuthSession>> {
    return authRequest<AuthSession>("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /**
   * ログアウト
   */
  async logout(): Promise<ApiResponse<{ success: true }>> {
    return authRequest<{ success: true }>("/api/auth/sign-out", {
      method: "POST",
    });
  },

  /**
   * 現在のセッションを取得
   */
  async getSession(): Promise<ApiResponse<AuthSession | null>> {
    return authRequest<AuthSession | null>("/api/auth/get-session");
  },
} as const;

// === 統合API ===

export const api = {
  events: eventsApi,
  auth: authApi,
  health: healthApi,
} as const;

export type Api = typeof api;

// === ユーティリティ関数 ===

/**
 * APIレスポンスからデータを取得（エラー時はnull）
 */
export function unwrapOrNull<T>(response: ApiResponse<T>): T | null {
  return isSuccess(response) ? response.data : null;
}

/**
 * APIレスポンスからデータを取得（エラー時は例外）
 */
export function unwrapOrThrow<T>(response: ApiResponse<T>): T {
  if (isSuccess(response)) {
    return response.data;
  }
  throw new Error(response.error.message);
}
