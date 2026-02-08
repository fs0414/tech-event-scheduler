export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly image: string | null;
  readonly emailVerified: boolean;
}

export interface AuthSession {
  readonly user: AuthUser;
  readonly session: {
    readonly id: string;
    readonly expiresAt: string;
  };
}

export function isAuthSession(value: unknown): value is AuthSession {
  if (!isObject(value)) {
    return false;
  }

  if (!isObject(value.user)) {
    return false;
  }
  const user = value.user;
  if (
    typeof user.id !== "string" ||
    typeof user.email !== "string" ||
    typeof user.name !== "string"
  ) {
    return false;
  }

  if (!isObject(value.session)) {
    return false;
  }
  const session = value.session;
  if (
    typeof session.id !== "string" ||
    typeof session.expiresAt !== "string"
  ) {
    return false;
  }

  return true;
}

export function isSessionResponse(value: unknown): value is AuthSession | null {
  return value === null || isAuthSession(value);
}
