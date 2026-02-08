import { eq, and } from "drizzle-orm";
import { speaker } from "../schema";
import type { Speaker, NewSpeaker, UpdateSpeaker, User, Article } from "../schema";
import type { Database } from "./common";

export interface SpeakerWithDetails extends Speaker {
  readonly user: User;
  readonly article?: Article;
}

export interface SpeakerRepository {
  findById(id: number): Promise<Speaker | undefined>;
  findByEventId(eventId: number): Promise<readonly Speaker[]>;
  findByUserId(userId: string): Promise<readonly Speaker[]>;
  findByEventAndUser(eventId: number, userId: string): Promise<Speaker | undefined>;
  create(data: NewSpeaker): Promise<Speaker>;
  update(id: number, data: UpdateSpeaker): Promise<Speaker | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByEventId(eventId: number): Promise<number>;
}

export class DrizzleSpeakerRepository implements SpeakerRepository {
  constructor(private readonly db: Database) {}

  async findById(id: number): Promise<Speaker | undefined> {
    return this.db.select().from(speaker).where(eq(speaker.id, id)).get();
  }

  async findByEventId(eventId: number): Promise<readonly Speaker[]> {
    return this.db.select().from(speaker).where(eq(speaker.eventId, eventId)).all();
  }

  async findByUserId(userId: string): Promise<readonly Speaker[]> {
    return this.db.select().from(speaker).where(eq(speaker.userId, userId)).all();
  }

  async findByEventAndUser(eventId: number, userId: string): Promise<Speaker | undefined> {
    return this.db
      .select()
      .from(speaker)
      .where(and(eq(speaker.eventId, eventId), eq(speaker.userId, userId)))
      .get();
  }

  async create(data: NewSpeaker): Promise<Speaker> {
    return this.db.insert(speaker).values(data).returning().get();
  }

  async update(id: number, data: UpdateSpeaker): Promise<Speaker | undefined> {
    return this.db.update(speaker).set(data).where(eq(speaker.id, id)).returning().get();
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(speaker).where(eq(speaker.id, id)).returning().get();
    return result !== undefined;
  }

  async deleteByEventId(eventId: number): Promise<number> {
    const result = await this.db
      .delete(speaker)
      .where(eq(speaker.eventId, eventId))
      .returning()
      .all();
    return result.length;
  }
}

export function createSpeakerRepository(db: Database): SpeakerRepository {
  return new DrizzleSpeakerRepository(db);
}
