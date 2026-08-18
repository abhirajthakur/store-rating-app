import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../config/env.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 30_000,
});

export const db = drizzle({ client: pool });
