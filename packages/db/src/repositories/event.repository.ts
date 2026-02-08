import { eq, like, desc, inArray } from "drizzle-orm";
import { event, owner } from "../schema";
import type { Event, NewEvent, UpdateEvent } from "../schema";
import type { Database, PaginationOptions } from "./common";

export interface EventSearchCriteria {
  readonly titleContains?: string;
}

export interface EventRepository {
  findById(id: number): Promise<Event | undefined>;
  findAll(options?: PaginationOptions): Promise<readonly Event[]>;
  findByCriteria(
    criteria: EventSearchCriteria,
    options?: PaginationOptions
  ): Promise<readonly Event[]>;
  findByOwnerId(
    userId: string,
    options?: PaginationOptions
  ): Promise<readonly Event[]>;
  create(data: NewEvent): Promise<Event>;
  update(id: number, data: UpdateEvent): Promise<Event | undefined>;
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
}

export class DrizzleEventRepository implements EventRepository {
  constructor(private readonly db: Database) {}

  async findById(id: number): Promise<Event | undefined> {
    return this.db.select().from(event).where(eq(event.id, id)).get();
  }

  async findAll(_options?: PaginationOptions): Promise<readonly Event[]> {
    return this.db.select().from(event).orderBy(desc(event.createdAt)).all();
  }

  async findByCriteria(
    criteria: EventSearchCriteria,
    _options?: PaginationOptions
  ): Promise<readonly Event[]> {
    if (criteria.titleContains) {
      return this.db
        .select()
        .from(event)
        .where(like(event.title, `%${criteria.titleContains}%`))
        .orderBy(desc(event.createdAt))
        .all();
    }
    return this.findAll(_options);
  }

  async findByOwnerId(
    userId: string,
    _options?: PaginationOptions
  ): Promise<readonly Event[]> {
    const ownerRecords = await this.db
      .select()
      .from(owner)
      .where(eq(owner.userId, userId))
      .all();

    if (ownerRecords.length === 0) {
      return [];
    }

    const eventIds = ownerRecords.map((o) => o.eventId);
    return this.db
      .select()
      .from(event)
      .where(inArray(event.id, eventIds))
      .orderBy(desc(event.createdAt))
      .all();
  }

  async create(data: NewEvent): Promise<Event> {
    const result = await this.db.insert(event).values(data).returning().get();
    return result;
  }

  async update(id: number, data: UpdateEvent): Promise<Event | undefined> {
    const result = await this.db
      .update(event)
      .set(data)
      .where(eq(event.id, id))
      .returning()
      .get();
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(event)
      .where(eq(event.id, id))
      .returning()
      .get();
    return result !== undefined;
  }

  async exists(id: number): Promise<boolean> {
    const result = await this.findById(id);
    return result !== undefined;
  }
}

export function createEventRepository(db: Database): EventRepository {
  return new DrizzleEventRepository(db);
}
