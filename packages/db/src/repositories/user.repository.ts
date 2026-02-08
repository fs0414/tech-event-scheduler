import { eq } from "drizzle-orm";
import { user } from "../schema";
import type { User } from "../schema";
import type { Database } from "./common";

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  exists(id: string): Promise<boolean>;
}

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<User | undefined> {
    return this.db.select().from(user).where(eq(user.id, id)).get();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.select().from(user).where(eq(user.email, email)).get();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id);
    return result !== undefined;
  }
}

export function createUserRepository(db: Database): UserRepository {
  return new DrizzleUserRepository(db);
}
