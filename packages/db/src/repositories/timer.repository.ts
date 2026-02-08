import { eq, asc } from "drizzle-orm";
import { timer } from "../schema";
import type { Timer, NewTimer, UpdateTimer } from "../schema";
import type { Database } from "./common";

export interface TimerRepository {
  findById(id: number): Promise<Timer | undefined>;
  findByEventId(eventId: number): Promise<readonly Timer[]>;
  create(data: NewTimer): Promise<Timer>;
  update(id: number, data: UpdateTimer): Promise<Timer | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByEventId(eventId: number): Promise<number>;
  reorder(eventId: number, timerIds: number[]): Promise<void>;
}

export class DrizzleTimerRepository implements TimerRepository {
  constructor(private readonly db: Database) {}

  async findById(id: number): Promise<Timer | undefined> {
    return this.db.select().from(timer).where(eq(timer.id, id)).get();
  }

  async findByEventId(eventId: number): Promise<readonly Timer[]> {
    return this.db
      .select()
      .from(timer)
      .where(eq(timer.eventId, eventId))
      .orderBy(asc(timer.sequence))
      .all();
  }

  async create(data: NewTimer): Promise<Timer> {
    return this.db.insert(timer).values(data).returning().get();
  }

  async update(id: number, data: UpdateTimer): Promise<Timer | undefined> {
    return this.db.update(timer).set(data).where(eq(timer.id, id)).returning().get();
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(timer).where(eq(timer.id, id)).returning().get();
    return result !== undefined;
  }

  async deleteByEventId(eventId: number): Promise<number> {
    const result = await this.db
      .delete(timer)
      .where(eq(timer.eventId, eventId))
      .returning()
      .all();
    return result.length;
  }

  async reorder(_eventId: number, timerIds: number[]): Promise<void> {
    const now = new Date();
    for (let i = 0; i < timerIds.length; i++) {
      await this.db
        .update(timer)
        .set({ sequence: i + 1, updatedAt: now })
        .where(eq(timer.id, timerIds[i]));
    }
  }
}

export function createTimerRepository(db: Database): TimerRepository {
  return new DrizzleTimerRepository(db);
}
