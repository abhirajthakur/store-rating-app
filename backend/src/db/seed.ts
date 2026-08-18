import bcrypt from "bcrypt";
import { db, pool } from "./client.js";
import { users } from "./schema.js";

async function seed() {
  const passwordHash = await bcrypt.hash("Admin@1234", 10);

  await db
    .insert(users)
    .values({
      name: "System Administrator Account",
      email: "admin@storerating.com",
      passwordHash,
      address: "Platform HQ, Admin Office, City",
      role: "admin",
    })
    .onConflictDoNothing();

  console.log("Seed complete: default admin created (or already exists).");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
