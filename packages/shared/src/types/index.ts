export * from "./branded";
export * from "./result";
export * from "./api";
export * from "./enums";
export * from "./datetime";

import type {
  EventId,
  UserId,
  OwnerId,
  ArticleId,
  SpeakerId,
  TimerId,
} from "./branded";
import type { OwnerRole } from "./enums";
import type { ISO8601String } from "./datetime";

export interface BaseEntity {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface User extends BaseEntity {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
}

export interface Event extends BaseEntity {
  readonly id: EventId;
  readonly title: string;
  readonly eventUrl: string | null;
  readonly attendance: number;
}

export interface Owner extends BaseEntity {
  readonly id: OwnerId;
  readonly userId: UserId;
  readonly eventId: EventId;
  readonly role: OwnerRole;
}

export interface Article extends BaseEntity {
  readonly id: ArticleId;
  readonly title: string;
  readonly description: string | null;
  readonly url: string | null;
}

export interface Speaker extends BaseEntity {
  readonly id: SpeakerId;
  readonly userId: UserId;
  readonly eventId: EventId;
  readonly articleId: ArticleId | null;
  readonly role: string | null;
}

export interface Timer extends BaseEntity {
  readonly id: TimerId;
  readonly eventId: EventId;
  readonly durationMinutes: number;
  readonly sequence: number;
}

export interface CreateEventInput {
  readonly title: string;
  readonly eventUrl?: string;
}

export interface UpdateEventInput {
  readonly title?: string;
  readonly eventUrl?: string | null;
  readonly attendance?: number;
}

export interface EventResponse {
  readonly id: number;
  readonly title: string;
  readonly eventUrl: string | null;
  readonly attendance: number;
  readonly createdAt: ISO8601String;
  readonly updatedAt: ISO8601String;
}

export interface UserPublicResponse {
  readonly id: string;
  readonly name: string;
  readonly image: string | null;
}

export interface UserResponse extends UserPublicResponse {
  readonly email: string;
  readonly emailVerified: boolean;
  readonly createdAt: ISO8601String;
  readonly updatedAt: ISO8601String;
}
