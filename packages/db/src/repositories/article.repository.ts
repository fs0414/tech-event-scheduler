import { eq, desc } from "drizzle-orm";
import { article } from "../schema";
import type { Article, NewArticle, UpdateArticle } from "../schema";
import type { Database, PaginationOptions } from "./common";

export interface ArticleRepository {
  findById(id: number): Promise<Article | undefined>;
  findAll(options?: PaginationOptions): Promise<readonly Article[]>;
  create(data: NewArticle): Promise<Article>;
  update(id: number, data: UpdateArticle): Promise<Article | undefined>;
  delete(id: number): Promise<boolean>;
}

export class DrizzleArticleRepository implements ArticleRepository {
  constructor(private readonly db: Database) {}

  async findById(id: number): Promise<Article | undefined> {
    return this.db.select().from(article).where(eq(article.id, id)).get();
  }

  async findAll(_options?: PaginationOptions): Promise<readonly Article[]> {
    return this.db.select().from(article).orderBy(desc(article.createdAt)).all();
  }

  async create(data: NewArticle): Promise<Article> {
    return this.db.insert(article).values(data).returning().get();
  }

  async update(id: number, data: UpdateArticle): Promise<Article | undefined> {
    return this.db.update(article).set(data).where(eq(article.id, id)).returning().get();
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(article).where(eq(article.id, id)).returning().get();
    return result !== undefined;
  }
}

export function createArticleRepository(db: Database): ArticleRepository {
  return new DrizzleArticleRepository(db);
}
