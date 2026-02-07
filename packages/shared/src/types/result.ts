/**
 * Result型 - 型安全なエラーハンドリング
 *
 * RustのResult型にインスパイアされた実装で、
 * APIレスポンスやビジネスロジックのエラーハンドリングを型安全に行えます。
 */

// === Result型の定義 ===

export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly success: true;
  readonly data: T;
}

export interface Failure<E> {
  readonly success: false;
  readonly error: E;
}

// === Result作成関数 ===

export function success<T>(data: T): Success<T> {
  return { success: true, data };
}

export function failure<E>(error: E): Failure<E> {
  return { success: false, error };
}

// === 型ガード ===

export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result.success === true;
}

export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return result.success === false;
}

// === ユーティリティ関数 ===

/**
 * Resultから値を取り出す。失敗時はデフォルト値を返す。
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isSuccess(result) ? result.data : defaultValue;
}

/**
 * Resultから値を取り出す。失敗時は例外をスローする。
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isSuccess(result)) {
    return result.data;
  }
  throw result.error instanceof Error ? result.error : new Error(String(result.error));
}

/**
 * Resultの値を変換する
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (isSuccess(result)) {
    return success(fn(result.data));
  }
  return result;
}

/**
 * 成功時に別のResultを返す関数を適用する
 */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (isSuccess(result)) {
    return fn(result.data);
  }
  return result;
}

/**
 * 非同期関数をResult型でラップする
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    const data = await fn();
    return success(data);
  } catch (e) {
    return failure(e instanceof Error ? e : new Error(String(e)));
  }
}
