/**
 * User Repository 実装
 */

import { eq } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { user } from "../schema";
import type { User } from "../schema";
import type { UserRepository } from "./types";

/**
 * UserRepository の Drizzle 実装
 */
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: string): Promise<User | undefined> {
    return this.adapter.select(user).where(eq(user.id, id)).get();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.adapter.select(user).where(eq(user.email, email)).get();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id);
    return result !== undefined;
  }
}

/**
 * UserRepository を作成
 */
export function createUserRepository(adapter: DatabaseAdapter): UserRepository {
  return new DrizzleUserRepository(adapter);
}
