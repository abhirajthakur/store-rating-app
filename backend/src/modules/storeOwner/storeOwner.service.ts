import { eq, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { ratings, stores, users } from "../../db/schema.js";

export async function getStoreOwnerDashboard(ownerId: string) {
  const [store] = await db.select().from(stores).where(eq(stores.ownerId, ownerId)).limit(1);
  if (!store) {
    const err: any = new Error("No store found for this owner");
    err.status = 404;
    throw err;
  }

  const raters = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      rating: ratings.rating,
      ratedAt: ratings.createdAt,
    })
    .from(ratings)
    .innerJoin(users, eq(ratings.userId, users.id))
    .where(eq(ratings.storeId, store.id));

  const [avg] = await db
    .select({ average: sql<number>`COALESCE(AVG(${ratings.rating}), 0)` })
    .from(ratings)
    .where(eq(ratings.storeId, store.id));

  return {
    store: { id: store.id, name: store.name, address: store.address },
    averageRating: avg!.average,
    raters,
  };
}
