/**
 * 環境変数の型定義
 */

/**
 * Cloudflare Workers環境変数
 */
export interface Env {
  // D1 (本番) または DATABASE_URL (ローカル) のいずれか
  readonly DB?: D1Database;
  readonly DATABASE_URL?: string;
  readonly CORS_ORIGIN: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly BETTER_AUTH_URL: string;
}

/**
 * 環境変数のバリデーション
 */
export function validateEnv(env: unknown): env is Env {
  if (typeof env !== "object" || env === null) {
    return false;
  }

  const e = env as Record<string, unknown>;

  // DB または DATABASE_URL のいずれかが必要
  const hasDatabase =
    (typeof e.DB === "object" && e.DB !== null) ||
    typeof e.DATABASE_URL === "string";

  return (
    hasDatabase &&
    typeof e.CORS_ORIGIN === "string" &&
    typeof e.BETTER_AUTH_SECRET === "string" &&
    typeof e.BETTER_AUTH_URL === "string"
  );
}

/**
 * 環境変数を検証して返す（失敗時はエラー）
 */
export function getValidatedEnv(env: unknown): Env {
  if (!validateEnv(env)) {
    throw new Error("Invalid environment variables");
  }
  return env;
}
