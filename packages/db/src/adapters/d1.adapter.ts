/**
 * Cloudflare D1 用 Database Adapter
 */

import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";
import { DrizzleAdapter } from "./drizzle.adapter";
import type { DatabaseAdapter } from "./types";

/**
 * D1 Database から DatabaseAdapter を作成
 */
export function createD1Adapter(d1: D1Database): DatabaseAdapter {
  const drizzleInstance = drizzle(d1, { schema });
  return new DrizzleAdapter(drizzleInstance);
}
