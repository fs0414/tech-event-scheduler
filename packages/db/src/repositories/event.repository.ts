/**
 * Event Repository 実装
 */

import { eq, like, desc } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { event, owner } from "../schema";
import type { Event, NewEvent, UpdateEvent } from "../schema";
import type {
  EventRepository,
  EventSearchCriteria,
  PaginationOptions,
} from "./types";

export class DrizzleEventRepository implements EventRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: number): Promise<Event | undefined> {
    return this.adapter.select(event).where(eq(event.id, id)).get();
  }

  async findAll(_options?: PaginationOptions): Promise<readonly Event[]> {
    return this.adapter.select(event).orderBy(desc(event.createdAt)).all();
  }

  async findByCriteria(
    criteria: EventSearchCriteria,
    _options?: PaginationOptions
  ): Promise<readonly Event[]> {
    if (criteria.titleContains) {
      return this.adapter
        .select(event)
        .orderBy(desc(event.createdAt))
        .where(like(event.title, `%${criteria.titleContains}%`))
        .all();
    }

    return this.findAll(_options);
  }

  async findByOwnerId(
    userId: string,
    _options?: PaginationOptions
  ): Promise<readonly Event[]> {
    const ownerEvents = await this.adapter
      .select(owner)
      .where(eq(owner.userId, userId))
      .all();

    if (ownerEvents.length === 0) {
      return [];
    }

    const eventIds = ownerEvents.map((o) => o.eventId);
    const events: Event[] = [];

    for (const eventId of eventIds) {
      const ev = await this.findById(eventId);
      if (ev) {
        events.push(ev);
      }
    }

    return events.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async create(data: NewEvent): Promise<Event> {
    const result = await this.adapter.insert(event, data);
    const insertedId = Number(result.lastInsertRowid);
    const created = await this.findById(insertedId);
    if (!created) {
      throw new Error("Failed to create event");
    }
    return created;
  }

  async update(id: number, data: UpdateEvent): Promise<Event | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(event, data, eq(event.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(event, eq(event.id, id));
    return true;
  }

  async exists(id: number): Promise<boolean> {
    const result = await this.findById(id);
    return result !== undefined;
  }
}

export function createEventRepository(
  adapter: DatabaseAdapter
): EventRepository {
  return new DrizzleEventRepository(adapter);
}
