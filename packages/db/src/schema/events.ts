import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { user } from "./auth";

// === 参加ステータス列挙型 ===

export const PARTICIPANT_STATUSES = ["pending", "confirmed", "cancelled"] as const;
export type ParticipantStatusDB = (typeof PARTICIPANT_STATUSES)[number];

// === イベントテーブル ===

export const event = sqliteTable("event", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  location: text("location"),
  url: text("url"),
  organizerId: text("organizer_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Event = InferSelectModel<typeof event>;
export type NewEvent = InferInsertModel<typeof event>;

/**
 * イベント更新用の型（部分更新対応）
 */
export type UpdateEvent = Partial<Omit<NewEvent, "id" | "createdAt">> & {
  updatedAt: Date;
};

// === イベント参加者テーブル ===

export const eventParticipant = sqliteTable("event_participant", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => event.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  status: text("status", { enum: PARTICIPANT_STATUSES })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type EventParticipant = InferSelectModel<typeof eventParticipant>;
export type NewEventParticipant = InferInsertModel<typeof eventParticipant>;

/**
 * 参加ステータス更新用の型
 */
export type UpdateEventParticipant = {
  status: ParticipantStatusDB;
  updatedAt: Date;
};
