/**
 * データベースプラグイン
 */

import { Elysia } from "elysia";
import type { Repositories } from "@tech-event-scheduler/db";

/**
 * リポジトリコンテキストを注入するプラグイン
 */
export const repositoriesPlugin = (repositories: Repositories) =>
  new Elysia({ name: "repositories" }).derive(() => ({
    repositories,
  }));

export type RepositoriesPlugin = ReturnType<typeof repositoriesPlugin>;
