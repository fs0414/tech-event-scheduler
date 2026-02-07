/**
 * Event Repository 実装
 */

import { eq, and, gte, lte, like, desc } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { event } from "../schema";
import type { Event, NewEvent, UpdateEvent } from "../schema";
import type {
  EventRepository,
  EventSearchCriteria,
  PaginationOptions,
} from "./types";

/**
 * EventRepository の Drizzle 実装
 */
export class DrizzleEventRepository implements EventRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: string): Promise<Event | undefined> {
    return this.adapter.select(event).where(eq(event.id, id)).get();
  }

  async findAll(_options?: PaginationOptions): Promise<readonly Event[]> {
    return this.adapter.select(event).orderBy(desc(event.startDate)).all();
  }

  async findByCriteria(
    criteria: EventSearchCriteria,
    _options?: PaginationOptions
  ): Promise<readonly Event[]> {
    const conditions = this.buildConditions(criteria);

    if (conditions.length === 0) {
      return this.findAll(_options);
    }

    return this.adapter
      .select(event)
      .orderBy(desc(event.startDate))
      .where(and(...conditions))
      .all();
  }

  async findByOrganizerId(
    organizerId: string,
    _options?: PaginationOptions
  ): Promise<readonly Event[]> {
    return this.adapter
      .select(event)
      .orderBy(desc(event.startDate))
      .where(eq(event.organizerId, organizerId))
      .all();
  }

  async create(data: NewEvent): Promise<Event> {
    await this.adapter.insert(event, data);
    // SQLiteではRETURNINGがサポートされないため、挿入後に取得
    const created = await this.findById(data.id);
    if (!created) {
      throw new Error("Failed to create event");
    }
    return created;
  }

  async update(id: string, data: UpdateEvent): Promise<Event | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(event, data, eq(event.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(event, eq(event.id, id));
    return true;
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id);
    return result !== undefined;
  }

  private buildConditions(criteria: EventSearchCriteria) {
    const conditions = [];

    if (criteria.organizerId) {
      conditions.push(eq(event.organizerId, criteria.organizerId));
    }

    if (criteria.startDateFrom) {
      conditions.push(gte(event.startDate, criteria.startDateFrom));
    }

    if (criteria.startDateTo) {
      conditions.push(lte(event.startDate, criteria.startDateTo));
    }

    if (criteria.titleContains) {
      conditions.push(like(event.title, `%${criteria.titleContains}%`));
    }

    return conditions;
  }
}

/**
 * EventRepository を作成
 */
export function createEventRepository(
  adapter: DatabaseAdapter
): EventRepository {
  return new DrizzleEventRepository(adapter);
}
