import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { users } from "../../db/schema.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";

import type { LoginInput, RegisterInput } from "./auth.schema.js";

function toSafeUser(user: typeof users.$inferSelect) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function registerUser(input: RegisterInput) {
  const [existing] = await db.select().from(users).where(eq(users.email, input.email));

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
      role: "normal",
    })
    .returning();

  return toSafeUser(created!);
}

export async function loginUser(input: LoginInput) {
  const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

  if (!user) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user.id, role: user.role });

  return { token, user: toSafeUser(user) };
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) {
    const err: any = new Error("Current password is incorrect");
    err.status = 401;
    throw err;
  }

  const newHash = await hashPassword(newPassword);

  await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, userId));
}
