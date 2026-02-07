/**
 * 型安全なエラーハンドリングプラグイン
 */

import { Elysia } from "elysia";
import {
  type ApiError,
  type ApiResponse,
  ERROR_STATUS_MAP,
  ApiErrors,
  success,
  failure,
} from "@tech-event-scheduler/shared";

/**
 * アプリケーションエラークラス
 */
export class AppError extends Error {
  constructor(
    public readonly apiError: ApiError,
    public readonly statusCode: number = ERROR_STATUS_MAP[apiError.code]
  ) {
    super(apiError.message);
    this.name = "AppError";
  }

  static badRequest(message: string, details?: Record<string, unknown>): AppError {
    return new AppError(ApiErrors.badRequest(message, details), 400);
  }

  static unauthorized(message?: string): AppError {
    return new AppError(ApiErrors.unauthorized(message), 401);
  }

  static forbidden(message?: string): AppError {
    return new AppError(ApiErrors.forbidden(message), 403);
  }

  static notFound(resource: string): AppError {
    return new AppError(ApiErrors.notFound(resource), 404);
  }

  static conflict(message: string): AppError {
    return new AppError(ApiErrors.conflict(message), 409);
  }

  static validationError(
    message: string,
    details?: Record<string, unknown>
  ): AppError {
    return new AppError(ApiErrors.validationError(message, details), 422);
  }

  static internal(message?: string): AppError {
    return new AppError(ApiErrors.internalError(message), 500);
  }
}

/**
 * エラーハンドリングプラグイン
 */
export const errorHandlerPlugin = new Elysia({ name: "error-handler" })
  .error({ APP_ERROR: AppError })
  .onError(({ code, error, set }) => {
    // AppErrorの場合
    if (code === "APP_ERROR" && error instanceof AppError) {
      set.status = error.statusCode;
      return failure(error.apiError);
    }

    // バリデーションエラーの場合
    if (code === "VALIDATION") {
      set.status = 422;
      return failure(
        ApiErrors.validationError("入力値が不正です", {
          details: error.message,
        })
      );
    }

    // Not Foundの場合
    if (code === "NOT_FOUND") {
      set.status = 404;
      return failure(ApiErrors.notFound("リソース"));
    }

    // その他のエラー
    console.error("Unhandled error:", error);
    set.status = 500;
    return failure(ApiErrors.internalError());
  })
  .derive(() => ({
    /**
     * 成功レスポンスを返すヘルパー
     */
    ok: <T>(data: T): ApiResponse<T> => success(data),

    /**
     * エラーをスローするヘルパー
     */
    throw: {
      badRequest: (message: string, details?: Record<string, unknown>) => {
        throw AppError.badRequest(message, details);
      },
      unauthorized: (message?: string) => {
        throw AppError.unauthorized(message);
      },
      forbidden: (message?: string) => {
        throw AppError.forbidden(message);
      },
      notFound: (resource: string) => {
        throw AppError.notFound(resource);
      },
      conflict: (message: string) => {
        throw AppError.conflict(message);
      },
      validationError: (
        message: string,
        details?: Record<string, unknown>
      ) => {
        throw AppError.validationError(message, details);
      },
      internal: (message?: string) => {
        throw AppError.internal(message);
      },
    },
  }));

export type ErrorHandlerPlugin = typeof errorHandlerPlugin;
