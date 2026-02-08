import { eq, and } from "drizzle-orm";
import { owner } from "../schema";
import type { Owner, NewOwner, UpdateOwner, User } from "../schema";
import type { Database } from "./common";

export interface OwnerWithUser extends Owner {
  readonly user: User;
}

export interface OwnerRepository {
  findById(id: number): Promise<Owner | undefined>;
  findByEventId(eventId: number): Promise<readonly Owner[]>;
  findByUserId(userId: string): Promise<readonly Owner[]>;
  findByEventAndUser(eventId: number, userId: string): Promise<Owner | undefined>;
  create(data: NewOwner): Promise<Owner>;
  update(id: number, data: UpdateOwner): Promise<Owner | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByEventId(eventId: number): Promise<number>;
}

export class DrizzleOwnerRepository implements OwnerRepository {
  constructor(private readonly db: Database) {}

  async findById(id: number): Promise<Owner | undefined> {
    return this.db.select().from(owner).where(eq(owner.id, id)).get();
  }

  async findByEventId(eventId: number): Promise<readonly Owner[]> {
    return this.db.select().from(owner).where(eq(owner.eventId, eventId)).all();
  }

  async findByUserId(userId: string): Promise<readonly Owner[]> {
    return this.db.select().from(owner).where(eq(owner.userId, userId)).all();
  }

  async findByEventAndUser(eventId: number, userId: string): Promise<Owner | undefined> {
    return this.db
      .select()
      .from(owner)
      .where(and(eq(owner.eventId, eventId), eq(owner.userId, userId)))
      .get();
  }

  async create(data: NewOwner): Promise<Owner> {
    return this.db.insert(owner).values(data).returning().get();
  }

  async update(id: number, data: UpdateOwner): Promise<Owner | undefined> {
    return this.db.update(owner).set(data).where(eq(owner.id, id)).returning().get();
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(owner).where(eq(owner.id, id)).returning().get();
    return result !== undefined;
  }

  async deleteByEventId(eventId: number): Promise<number> {
    const result = await this.db
      .delete(owner)
      .where(eq(owner.eventId, eventId))
      .returning()
      .all();
    return result.length;
  }
}

export function createOwnerRepository(db: Database): OwnerRepository {
  return new DrizzleOwnerRepository(db);
}
