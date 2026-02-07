/**
 * Article Repository 実装
 */

import { eq, desc } from "drizzle-orm";
import type { DatabaseAdapter } from "../adapters/types";
import { article } from "../schema";
import type { Article, NewArticle, UpdateArticle } from "../schema";
import type { ArticleRepository, PaginationOptions } from "./types";

export class DrizzleArticleRepository implements ArticleRepository {
  constructor(private readonly adapter: DatabaseAdapter) {}

  async findById(id: number): Promise<Article | undefined> {
    return this.adapter.select(article).where(eq(article.id, id)).get();
  }

  async findAll(_options?: PaginationOptions): Promise<readonly Article[]> {
    return this.adapter
      .select(article)
      .orderBy(desc(article.createdAt))
      .all();
  }

  async create(data: NewArticle): Promise<Article> {
    const result = await this.adapter.insert(article, data);
    const insertedId = Number(result.lastInsertRowid);
    const created = await this.findById(insertedId);
    if (!created) {
      throw new Error("Failed to create article");
    }
    return created;
  }

  async update(id: number, data: UpdateArticle): Promise<Article | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await this.adapter.update(article, data, eq(article.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.adapter.delete(article, eq(article.id, id));
    return true;
  }
}

export function createArticleRepository(
  adapter: DatabaseAdapter
): ArticleRepository {
  return new DrizzleArticleRepository(adapter);
}
