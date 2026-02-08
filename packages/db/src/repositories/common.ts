import type { Database } from "../client";

export type { Database };

export interface PaginationOptions {
  readonly limit?: number;
  readonly offset?: number;
}
