declare const brand: unique symbol;

export type Brand<T, TBrand extends string> = T & {
  readonly [brand]: TBrand;
};

export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;

export type UserId = Brand<string, "UserId">;
export type EventId = Brand<number, "EventId">;
export type OwnerId = Brand<number, "OwnerId">;
export type ArticleId = Brand<number, "ArticleId">;
export type SpeakerId = Brand<number, "SpeakerId">;
export type TimerId = Brand<number, "TimerId">;
export type SessionId = Brand<string, "SessionId">;
export type AccountId = Brand<string, "AccountId">;
export type VerificationId = Brand<string, "VerificationId">;

export function createId<T extends Brand<string, string>>(): T {
  return crypto.randomUUID() as T;
}

export function parseId<T extends Brand<string, string>>(
  id: string,
  _brandName?: string
): T {
  if (!isValidUUID(id)) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  return id as T;
}

export function unsafeParseId<T extends Brand<string, string>>(id: string): T {
  return id as T;
}

export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function isUserId(id: string): id is UserId {
  return isValidUUID(id);
}

export function isEventId(id: number): id is EventId {
  return Number.isInteger(id) && id > 0;
}
