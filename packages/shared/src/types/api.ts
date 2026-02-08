import type { Result } from "./result";

export const API_ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export interface ApiError {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export type ApiResponse<T> = Result<T, ApiError>;

export type ApiResult<T> = Promise<ApiResponse<T>>;

export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginatedData<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export const ERROR_STATUS_MAP: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
} as const;

export function createApiError(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>
): ApiError {
  return { code, message, details };
}

export const ApiErrors = {
  badRequest: (message: string, details?: Record<string, unknown>): ApiError =>
    createApiError("BAD_REQUEST", message, details),

  unauthorized: (message = "認証が必要です"): ApiError =>
    createApiError("UNAUTHORIZED", message),

  forbidden: (message = "アクセス権限がありません"): ApiError =>
    createApiError("FORBIDDEN", message),

  notFound: (resource: string): ApiError =>
    createApiError("NOT_FOUND", `${resource}が見つかりません`),

  conflict: (message: string): ApiError =>
    createApiError("CONFLICT", message),

  validationError: (
    message: string,
    details?: Record<string, unknown>
  ): ApiError => createApiError("VALIDATION_ERROR", message, details),

  internalError: (message = "内部エラーが発生しました"): ApiError =>
    createApiError("INTERNAL_ERROR", message),
} as const;
