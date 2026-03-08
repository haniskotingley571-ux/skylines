import { and, desc, eq, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, tags, articleTags, InsertArticle, InsertTag } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Article queries
export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(articles).values(data);
}

export async function getArticlesByUserId(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(articles)
    .where(eq(articles.userId, userId))
    .orderBy(desc(articles.updatedAt))
    .limit(limit)
    .offset(offset);
}

export async function getArticleBySlug(slug: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.userId, userId)))
    .limit(1);
  return result[0];
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(articles).set(data).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(articles).where(eq(articles.id, id));
}

export async function searchArticles(userId: number, query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.userId, userId),
        or(
          ilike(articles.title, `%${query}%`),
          ilike(articles.content, `%${query}%`)
        )
      )
    )
    .orderBy(desc(articles.updatedAt));
}

// Tag queries
export async function createTag(data: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(tags).values(data);
}

export async function getTagsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(tags).where(eq(tags.userId, userId));
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(tags).where(eq(tags.id, id));
}

// Article-Tag relations
export async function addTagToArticle(articleId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(articleTags).values({ articleId, tagId });
}

export async function removeTagFromArticle(articleId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .delete(articleTags)
    .where(and(eq(articleTags.articleId, articleId), eq(articleTags.tagId, tagId)));
}

export async function getArticleStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.userId, userId));
  return {
    totalArticles: result.length,
    totalViews: result.reduce((sum, a) => sum + (a.viewCount || 0), 0),
  };
}

export async function getRecentArticles(userId: number, limit = 5) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(articles)
    .where(eq(articles.userId, userId))
    .orderBy(desc(articles.updatedAt))
    .limit(limit);
}
