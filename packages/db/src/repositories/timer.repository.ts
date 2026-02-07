/**
 * Timer Repository 実装
 */

import { eq, asc } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { timer } from "../schema";
import type { Timer, NewTimer, UpdateTimer } from "../schema";
import type { TimerRepository } from "./types";

export class DrizzleTimerRepository implements TimerRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: number): Promise<Timer | undefined> {
    return this.adapter.select(timer).where(eq(timer.id, id)).get();
  }

  async findByEventId(eventId: number): Promise<readonly Timer[]> {
    return this.adapter
      .select(timer)
      .orderBy(asc(timer.sequence))
      .where(eq(timer.eventId, eventId))
      .all();
  }

  async create(data: NewTimer): Promise<Timer> {
    const result = await this.adapter.insert(timer, data);
    const insertedId = Number(result.lastInsertRowid);
    const created = await this.findById(insertedId);
    if (!created) {
      throw new Error("Failed to create timer");
    }
    return created;
  }

  async update(id: number, data: UpdateTimer): Promise<Timer | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(timer, data, eq(timer.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(timer, eq(timer.id, id));
    return true;
  }

  async deleteByEventId(eventId: number): Promise<number> {
    const timers = await this.findByEventId(eventId);
    const count = timers.length;

    if (count > 0) {
      await this.adapter.delete(timer, eq(timer.eventId, eventId));
    }

    return count;
  }

  async reorder(_eventId: number, timerIds: number[]): Promise<void> {
    const now = new Date();

    for (let i = 0; i < timerIds.length; i++) {
      await this.adapter.update(
        timer,
        { sequence: i + 1, updatedAt: now },
        eq(timer.id, timerIds[i])
      );
    }
  }
}

export function createTimerRepository(
  adapter: DatabaseAdapter
): TimerRepository {
  return new DrizzleTimerRepository(adapter);
}
