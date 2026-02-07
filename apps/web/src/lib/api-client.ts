/**
 * 型安全なAPIクライアント
 */

import {
  type ApiResponse,
  type EventResponse,
  type CreateEventInput,
  type UpdateEventInput,
  type ApiError,
  success,
  failure,
  isSuccess,
} from "@tech-event-scheduler/shared";

// === 設定 ===

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

// === HTTPクライアント ===

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers: customHeaders, ...restOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data: unknown = await response.json();

    // APIがResult型で返す場合
    if (
      typeof data === "object" &&
      data !== null &&
      "success" in data &&
      typeof (data as { success: unknown }).success === "boolean"
    ) {
      return data as ApiResponse<T>;
    }

    // 直接データが返ってくる場合（レガシー対応）
    if (response.ok) {
      return success(data as T);
    }

    // エラーレスポンス
    const errorData = data as { message?: string; details?: unknown } | null;
    const apiError: ApiError = {
      code: "INTERNAL_ERROR",
      message: errorData?.message ?? "リクエストに失敗しました",
      details:
        typeof errorData?.details === "object" && errorData.details !== null
          ? (errorData.details as Record<string, unknown>)
          : undefined,
    };
    return failure(apiError);
  } catch (error) {
    const apiError: ApiError = {
      code: "INTERNAL_ERROR",
      message:
        error instanceof Error ? error.message : "ネットワークエラーが発生しました",
    };
    return failure(apiError);
  }
}

// === イベントAPI ===

export const eventsApi = {
  /**
   * イベント一覧を取得
   */
  async list(): Promise<ApiResponse<readonly EventResponse[]>> {
    return request<readonly EventResponse[]>("/api/events");
  },

  /**
   * イベント詳細を取得
   */
  async get(id: string): Promise<ApiResponse<EventResponse>> {
    return request<EventResponse>(`/api/events/${id}`);
  },

  /**
   * イベントを作成
   */
  async create(input: CreateEventInput): Promise<ApiResponse<EventResponse>> {
    return request<EventResponse>("/api/events", {
      method: "POST",
      body: input,
    });
  },

  /**
   * イベントを更新
   */
  async update(
    id: string,
    input: UpdateEventInput
  ): Promise<ApiResponse<EventResponse>> {
    return request<EventResponse>(`/api/events/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  /**
   * イベントを削除
   */
  async delete(id: string): Promise<ApiResponse<{ deleted: true }>> {
    return request<{ deleted: true }>(`/api/events/${id}`, {
      method: "DELETE",
    });
  },
} as const;

// === 認証API ===

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

export const authApi = {
  /**
   * ログイン
   */
  async login(input: LoginInput): Promise<ApiResponse<AuthSession>> {
    return request<AuthSession>("/api/auth/sign-in/email", {
      method: "POST",
      body: input,
    });
  },

  /**
   * 新規登録
   */
  async register(input: RegisterInput): Promise<ApiResponse<AuthSession>> {
    return request<AuthSession>("/api/auth/sign-up/email", {
      method: "POST",
      body: input,
    });
  },

  /**
   * ログアウト
   */
  async logout(): Promise<ApiResponse<{ success: true }>> {
    return request<{ success: true }>("/api/auth/sign-out", {
      method: "POST",
    });
  },

  /**
   * 現在のセッションを取得
   */
  async getSession(): Promise<ApiResponse<AuthSession | null>> {
    return request<AuthSession | null>("/api/auth/get-session");
  },
} as const;

// === ヘルスチェックAPI ===

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
    return request<HealthStatus>("/health");
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
