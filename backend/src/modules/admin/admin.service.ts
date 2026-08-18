import { and, asc, count, desc, eq, ilike, inArray, SQL, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { ratings, stores, users } from "../../db/schema.js";
import { hashPassword } from "../../utils/hash.js";

import type {
  CreateStoreInput,
  CreateUserInput,
  ListStoresQuery,
  ListUsersQuery,
} from "./admin.schema.js";

export async function getDashboardStats() {
  const [userCount] = await db.select({ count: count() }).from(users);
  const [storeCount] = await db.select({ count: count() }).from(stores);
  const [ratingCount] = await db.select({ count: count() }).from(ratings);

  return {
    totalUsers: userCount!.count,
    totalStores: storeCount!.count,
    totalRatings: ratingCount!.count,
  };
}

export async function createUser(input: CreateUserInput) {
  const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
  if (existing) {
    const err: any = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(input.password);

  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      address: input.address,
      passwordHash,
      role: input.role,
    })
    .returning();

  const { passwordHash: _omit, ...safe } = created!;
  return safe;
}

export async function createStore(input: CreateStoreInput) {
  if (input.ownerId) {
    const [owner] = await db.select().from(users).where(eq(users.id, input.ownerId)).limit(1);
    if (!owner) {
      const err: any = new Error("ownerId does not match an existing user");
      err.status = 400;
      throw err;
    }
    if (owner.role !== "store_owner") {
      const err: any = new Error("ownerId must reference a user with role 'store_owner'");
      err.status = 400;
      throw err;
    }
  }

  const [created] = await db
    .insert(stores)
    .values({
      name: input.name,
      email: input.email,
      address: input.address,
      ownerId: input.ownerId ?? null,
    })
    .returning();

  return created;
}

const userSortColumns = {
  name: users.name,
  email: users.email,
  address: users.address,
  role: users.role,
  createdAt: users.createdAt,
};

export async function listUsers(query: ListUsersQuery) {
  const conditions: SQL[] = [];

  conditions.push(inArray(users.role, query.role ? [query.role] : ["admin", "normal"]));

  if (query.name) conditions.push(ilike(users.name, `%${query.name}%`));
  if (query.email) conditions.push(ilike(users.email, `%${query.email}%`));
  if (query.address) conditions.push(ilike(users.address, `%${query.address}%`));

  const sortCol = userSortColumns[query.sortBy];
  const orderFn = query.sortOrder === "desc" ? desc : asc;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      address: users.address,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(...conditions))
    .orderBy(orderFn(sortCol));

  return rows;
}

const storeSortColumns = {
  name: stores.name,
  email: stores.email,
  address: stores.address,
  createdAt: stores.createdAt,
};

export async function listStores(query: ListStoresQuery) {
  const conditions: SQL[] = [];

  if (query.name) conditions.push(ilike(stores.name, `%${query.name}%`));
  if (query.email) conditions.push(ilike(stores.email, `%${query.email}%`));
  if (query.address) conditions.push(ilike(stores.address, `%${query.address}%`));

  const ratingExpr = sql<number>`COALESCE(AVG(${ratings.rating}), 0)`;

  let orderExpr;
  if (query.sortBy === "rating") {
    orderExpr = query.sortOrder === "desc" ? desc(ratingExpr) : asc(ratingExpr);
  } else {
    const col = storeSortColumns[query.sortBy];
    orderExpr = query.sortOrder === "desc" ? desc(col) : asc(col);
  }

  const rows = await db
    .select({
      id: stores.id,
      name: stores.name,
      email: stores.email,
      address: stores.address,
      rating: ratingExpr,
    })
    .from(stores)
    .leftJoin(ratings, eq(ratings.storeId, stores.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(stores.id)
    .orderBy(orderExpr);

  return rows;
}

export async function getUserDetail(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const { passwordHash: _omit, ...safe } = user;

  if (user.role === "store_owner") {
    const [store] = await db.select().from(stores).where(eq(stores.ownerId, user.id)).limit(1);
    if (store) {
      const [avg] = await db
        .select({ rating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)` })
        .from(ratings)
        .where(eq(ratings.storeId, store.id));
      return { ...safe, rating: avg!.rating };
    }
  }

  return safe;
}
