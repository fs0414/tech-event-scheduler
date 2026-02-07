/**
 * Event Participant Repository 実装
 */

import { eq, and } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { eventParticipant } from "../schema";
import type {
  EventParticipant,
  NewEventParticipant,
  UpdateEventParticipant,
} from "../schema";
import type { EventParticipantRepository } from "./types";

/**
 * EventParticipantRepository の Drizzle 実装
 */
export class DrizzleEventParticipantRepository
  implements EventParticipantRepository
{
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: string): Promise<EventParticipant | undefined> {
    return this.adapter
      .select(eventParticipant)
      .where(eq(eventParticipant.id, id))
      .get();
  }

  async findByEventId(eventId: string): Promise<readonly EventParticipant[]> {
    return this.adapter
      .select(eventParticipant)
      .where(eq(eventParticipant.eventId, eventId))
      .all();
  }

  async findByUserId(userId: string): Promise<readonly EventParticipant[]> {
    return this.adapter
      .select(eventParticipant)
      .where(eq(eventParticipant.userId, userId))
      .all();
  }

  async findByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<EventParticipant | undefined> {
    return this.adapter
      .select(eventParticipant)
      .where(
        and(
          eq(eventParticipant.eventId, eventId),
          eq(eventParticipant.userId, userId)
        )
      )
      .get();
  }

  async create(data: NewEventParticipant): Promise<EventParticipant> {
    await this.adapter.insert(eventParticipant, data);
    const created = await this.findById(data.id);
    if (!created) {
      throw new Error("Failed to create event participant");
    }
    return created;
  }

  async updateStatus(
    id: string,
    data: UpdateEventParticipant
  ): Promise<EventParticipant | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(
      eventParticipant,
      data,
      eq(eventParticipant.id, id)
    );
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(eventParticipant, eq(eventParticipant.id, id));
    return true;
  }

  async deleteByEventId(eventId: string): Promise<number> {
    const participants = await this.findByEventId(eventId);
    const count = participants.length;

    if (count > 0) {
      await this.adapter.delete(
        eventParticipant,
        eq(eventParticipant.eventId, eventId)
      );
    }

    return count;
  }
}

/**
 * EventParticipantRepository を作成
 */
export function createEventParticipantRepository(
  adapter: DatabaseAdapter
): EventParticipantRepository {
  return new DrizzleEventParticipantRepository(adapter);
}
