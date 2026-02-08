import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { user } from "./auth";

export const OWNER_ROLES = {
  ADMIN: 10,
  MEMBER: 20,
} as const;

export type OwnerRole = (typeof OWNER_ROLES)[keyof typeof OWNER_ROLES];

export const event = sqliteTable("event", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  eventUrl: text("event_url"),
  attendance: integer("attendance").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Event = InferSelectModel<typeof event>;
export type NewEvent = InferInsertModel<typeof event>;
export type UpdateEvent = Partial<Omit<NewEvent, "id" | "createdAt">> & {
  updatedAt: Date;
};

export const owner = sqliteTable(
  "owner",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id),
    role: integer("role").notNull().default(OWNER_ROLES.MEMBER),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [uniqueIndex("owner_user_event_idx").on(table.userId, table.eventId)]
);

export type Owner = InferSelectModel<typeof owner>;
export type NewOwner = InferInsertModel<typeof owner>;
export type UpdateOwner = {
  role?: OwnerRole;
  updatedAt: Date;
};

export const article = sqliteTable("article", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Article = InferSelectModel<typeof article>;
export type NewArticle = InferInsertModel<typeof article>;
export type UpdateArticle = Partial<Omit<NewArticle, "id" | "createdAt">> & {
  updatedAt: Date;
};

export const speaker = sqliteTable(
  "speaker",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id),
    articleId: integer("article_id").references(() => article.id),
    role: text("role"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [uniqueIndex("speaker_user_event_idx").on(table.userId, table.eventId)]
);

export type Speaker = InferSelectModel<typeof speaker>;
export type NewSpeaker = InferInsertModel<typeof speaker>;
export type UpdateSpeaker = Partial<
  Omit<NewSpeaker, "id" | "userId" | "eventId" | "createdAt">
> & {
  updatedAt: Date;
};

export const timer = sqliteTable(
  "timer",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    durationMinutes: integer("duration_minutes").notNull(),
    sequence: integer("sequence").notNull(),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [uniqueIndex("timer_event_sequence_idx").on(table.eventId, table.sequence)]
);

export type Timer = InferSelectModel<typeof timer>;
export type NewTimer = InferInsertModel<typeof timer>;
export type UpdateTimer = Partial<
  Omit<NewTimer, "id" | "eventId" | "createdAt">
> & {
  updatedAt: Date;
};
