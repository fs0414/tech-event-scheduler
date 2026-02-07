/**
 * Speaker Repository 実装
 */

import { eq, and } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { speaker } from "../schema";
import type { Speaker, NewSpeaker, UpdateSpeaker } from "../schema";
import type { SpeakerRepository } from "./types";

export class DrizzleSpeakerRepository implements SpeakerRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: number): Promise<Speaker | undefined> {
    return this.adapter.select(speaker).where(eq(speaker.id, id)).get();
  }

  async findByEventId(eventId: number): Promise<readonly Speaker[]> {
    return this.adapter
      .select(speaker)
      .where(eq(speaker.eventId, eventId))
      .all();
  }

  async findByUserId(userId: string): Promise<readonly Speaker[]> {
    return this.adapter
      .select(speaker)
      .where(eq(speaker.userId, userId))
      .all();
  }

  async findByEventAndUser(
    eventId: number,
    userId: string
  ): Promise<Speaker | undefined> {
    return this.adapter
      .select(speaker)
      .where(and(eq(speaker.eventId, eventId), eq(speaker.userId, userId)))
      .get();
  }

  async create(data: NewSpeaker): Promise<Speaker> {
    const result = await this.adapter.insert(speaker, data);
    const insertedId = Number(result.lastInsertRowid);
    const created = await this.findById(insertedId);
    if (!created) {
      throw new Error("Failed to create speaker");
    }
    return created;
  }

  async update(id: number, data: UpdateSpeaker): Promise<Speaker | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(speaker, data, eq(speaker.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(speaker, eq(speaker.id, id));
    return true;
  }

  async deleteByEventId(eventId: number): Promise<number> {
    const speakers = await this.findByEventId(eventId);
    const count = speakers.length;

    if (count > 0) {
      await this.adapter.delete(speaker, eq(speaker.eventId, eventId));
    }

    return count;
  }
}

export function createSpeakerRepository(
  adapter: DatabaseAdapter
): SpeakerRepository {
  return new DrizzleSpeakerRepository(adapter);
}
