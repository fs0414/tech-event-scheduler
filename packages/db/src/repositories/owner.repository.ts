/**
 * Owner Repository 実装
 */

import { eq, and } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { owner } from "../schema";
import type { Owner, NewOwner, UpdateOwner } from "../schema";
import type { OwnerRepository } from "./types";

export class DrizzleOwnerRepository implements OwnerRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: number): Promise<Owner | undefined> {
    return this.adapter.select(owner).where(eq(owner.id, id)).get();
  }

  async findByEventId(eventId: number): Promise<readonly Owner[]> {
    return this.adapter
      .select(owner)
      .where(eq(owner.eventId, eventId))
      .all();
  }

  async findByUserId(userId: string): Promise<readonly Owner[]> {
    return this.adapter
      .select(owner)
      .where(eq(owner.userId, userId))
      .all();
  }

  async findByEventAndUser(
    eventId: number,
    userId: string
  ): Promise<Owner | undefined> {
    return this.adapter
      .select(owner)
      .where(and(eq(owner.eventId, eventId), eq(owner.userId, userId)))
      .get();
  }

  async create(data: NewOwner): Promise<Owner> {
    const result = await this.adapter.insert(owner, data);
    const insertedId = Number(result.lastInsertRowid);
    const created = await this.findById(insertedId);
    if (!created) {
      throw new Error("Failed to create owner");
    }
    return created;
  }

  async update(id: number, data: UpdateOwner): Promise<Owner | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(owner, data, eq(owner.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(owner, eq(owner.id, id));
    return true;
  }

  async deleteByEventId(eventId: number): Promise<number> {
    const owners = await this.findByEventId(eventId);
    const count = owners.length;

    if (count > 0) {
      await this.adapter.delete(owner, eq(owner.eventId, eventId));
    }

    return count;
  }
}

export function createOwnerRepository(
  adapter: DatabaseAdapter
): OwnerRepository {
  return new DrizzleOwnerRepository(adapter);
}
