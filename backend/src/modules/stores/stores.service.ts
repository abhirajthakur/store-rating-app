import { and, asc, desc, eq, ilike, SQL, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { ratings, stores } from "../../db/schema.js";

import type { ListStoresQuery } from "./stores.schema.js";

const sortColumns = {
  name: stores.name,
  address: stores.address,
};

export async function listStoresForUser(userId: string, query: ListStoresQuery) {
  const conditions: SQL[] = [];
  if (query.name) conditions.push(ilike(stores.name, `%${query.name}%`));
  if (query.address) conditions.push(ilike(stores.address, `%${query.address}%`));

  const overallRatingExpr = sql<number>`COALESCE(AVG(${ratings.rating}), 0)`;
  const userRatingExpr = sql<
    number | null
  >`MAX(CASE WHEN ${ratings.userId} = ${userId} THEN ${ratings.rating} ELSE NULL END)`;

  let orderExpr;
  if (query.sortBy === "rating") {
    orderExpr = query.sortOrder === "desc" ? desc(overallRatingExpr) : asc(overallRatingExpr);
  } else {
    const col = sortColumns[query.sortBy];
    orderExpr = query.sortOrder === "desc" ? desc(col) : asc(col);
  }

  const rows = await db
    .select({
      id: stores.id,
      name: stores.name,
      address: stores.address,
      overallRating: overallRatingExpr,
      userRating: userRatingExpr,
    })
    .from(stores)
    .leftJoin(ratings, eq(ratings.storeId, stores.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(stores.id)
    .orderBy(orderExpr);

  return rows;
}

export async function upsertRating(userId: string, storeId: string, rating: number) {
  const [store] = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
  if (!store) {
    const err: any = new Error("Store not found");
    err.status = 404;
    throw err;
  }

  const [existing] = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.storeId, storeId)))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(ratings)
      .set({ rating, updatedAt: new Date() })
      .where(eq(ratings.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db.insert(ratings).values({ userId, storeId, rating }).returning();
  return created;
}
