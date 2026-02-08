import { treaty } from "@elysiajs/eden";
import type { App } from "@tech-event-scheduler/api";
import {
  type ApiResponse,
  type ApiError,
  type ApiErrorCode,
  type EventResponse,
  type Success,
  type Failure,
  type AuthSession,
  type AuthUser,
  API_ERROR_CODES,
  success,
  failure,
  isSuccess,
  isObject,
  isAuthSession,
  isSessionResponse,
} from "@tech-event-scheduler/shared";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

export const edenClient = treaty<App>(API_BASE_URL, {
  fetch: {
    credentials: "include",
  },
});

function isApiError(value: unknown): value is ApiError {
  if (!isObject(value)) {
    return false;
  }
  return (
    typeof value.code === "string" &&
    Object.values(API_ERROR_CODES).includes(value.code as ApiErrorCode) &&
    typeof value.message === "string"
  );
}

function isSuccessResult<T>(value: unknown): value is Success<T> {
  if (!isObject(value)) {
    return false;
  }
  return value.success === true && "data" in value;
}

function isFailureResult(value: unknown): value is Failure<ApiError> {
  if (!isObject(value)) {
    return false;
  }
  return value.success === false && "error" in value && isApiError(value.error);
}

function isResultType<T>(value: unknown): value is ApiResponse<T> {
  return isSuccessResult<T>(value) || isFailureResult(value);
}

function extractErrorMessage(value: unknown): string {
  if (isObject(value) && typeof value.message === "string") {
    return value.message;
  }
  if (typeof value === "string") {
    return value;
  }
  return "リクエストに失敗しました";
}

function toApiResponse<T, EdenData = unknown>(result: {
  data: EdenData;
  error: { value: unknown } | null;
}): ApiResponse<T> {
  if (result.error) {
    return failure({
      code: "INTERNAL_ERROR",
      message: extractErrorMessage(result.error.value),
    });
  }

  if (result.data === null || result.data === undefined) {
    return failure({
      code: "INTERNAL_ERROR",
      message: "レスポンスデータがありません",
    });
  }

  const data: unknown = result.data;

  if (isResultType<T>(data)) {
    if (isSuccessResult<T>(data)) {
      return success(data.data);
    }
    return data;
  }

  return success(data as T);
}

export const eventsApi = {
  async list(): Promise<ApiResponse<readonly EventResponse[]>> {
    const result = await edenClient.api.events.get();
    return toApiResponse<readonly EventResponse[]>(result);
  },

  async get(id: string): Promise<ApiResponse<EventResponse>> {
    const result = await edenClient.api.events({ id }).get();
    return toApiResponse<EventResponse>(result);
  },

  async create(input: {
    title: string;
    eventUrl?: string;
  }): Promise<ApiResponse<EventResponse>> {
    const result = await edenClient.api.events.post(input);
    return toApiResponse<EventResponse>(result);
  },

  async update(
    id: string,
    input: { title?: string; eventUrl?: string | null; attendance?: number }
  ): Promise<ApiResponse<EventResponse>> {
    const result = await edenClient.api.events({ id }).patch(input);
    return toApiResponse<EventResponse>(result);
  },

  async delete(id: string): Promise<ApiResponse<{ deleted: true }>> {
    const result = await edenClient.api.events({ id }).delete();
    return toApiResponse<{ deleted: true }>(result);
  },
} as const;

export interface HealthStatus {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  version?: string;
}

export const healthApi = {
  async check(): Promise<ApiResponse<HealthStatus>> {
    const result = await edenClient.health.get();
    return toApiResponse<HealthStatus>(result);
  },
} as const;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

// AuthUser, AuthSession, isAuthSession は @tech-event-scheduler/shared から re-export
export type { AuthUser, AuthSession };

async function authRequest<T>(
  path: string,
  options: RequestInit = {},
  validator?: (value: unknown) => value is T
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
      if (validator) {
        if (validator(data)) {
          return success(data);
        }
        return failure({
          code: "INTERNAL_ERROR",
          message: "レスポンス形式が不正です",
        });
      }
      return success(data as T);
    }

    return failure({
      code: "INTERNAL_ERROR",
      message: extractErrorMessage(data) || "認証リクエストに失敗しました",
    });
  } catch (error) {
    return failure({
      code: "INTERNAL_ERROR",
      message:
        error instanceof Error ? error.message : "ネットワークエラーが発生しました",
    });
  }
}

function isLogoutResponse(value: unknown): value is { success: true } {
  if (!isObject(value)) {
    return false;
  }
  return value.success === true;
}

// isSessionResponse は @tech-event-scheduler/shared から import 済み

export const authApi = {
  async login(input: LoginInput): Promise<ApiResponse<AuthSession>> {
    return authRequest<AuthSession>(
      "/api/auth/sign-in/email",
      { method: "POST", body: JSON.stringify(input) },
      isAuthSession
    );
  },

  async register(input: RegisterInput): Promise<ApiResponse<AuthSession>> {
    return authRequest<AuthSession>(
      "/api/auth/sign-up/email",
      { method: "POST", body: JSON.stringify(input) },
      isAuthSession
    );
  },

  async logout(): Promise<ApiResponse<{ success: true }>> {
    return authRequest<{ success: true }>(
      "/api/auth/sign-out",
      { method: "POST" },
      isLogoutResponse
    );
  },

  async getSession(): Promise<ApiResponse<AuthSession | null>> {
    return authRequest<AuthSession | null>(
      "/api/auth/get-session",
      {},
      isSessionResponse
    );
  },

  async signInWithGoogle(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        provider: "google",
        callbackURL: window.location.origin,
      }),
    });

    const data = (await response.json()) as { url?: string };
    if (data.url) {
      window.location.href = data.url;
    }
  },
} as const;

export const api = {
  events: eventsApi,
  auth: authApi,
  health: healthApi,
} as const;

export type Api = typeof api;

export function unwrapOrNull<T>(response: ApiResponse<T>): T | null {
  return isSuccess(response) ? response.data : null;
}

export function unwrapOrThrow<T>(response: ApiResponse<T>): T {
  if (isSuccess(response)) {
    return response.data;
  }
  throw new Error(response.error.message);
}
