import { z } from "zod";

export const roleValues = ["admin", "normal", "store_owner"] as const;

const password = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/, "Must contain special character");

export const createUserSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.email("Invalid email address"),
  address: z.string().max(400),
  password,
  role: z.enum(roleValues),
});

export const createStoreSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.email("Invalid email address"),
  address: z.string().max(400),
  ownerId: z.uuid("ownerId must be a valid UUID").optional(),
});

const userSortFields = ["name", "email", "address", "role", "createdAt"] as const;
const storeSortFields = ["name", "email", "address", "rating", "createdAt"] as const;

export const listUsersQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["admin", "normal"]).optional(),
  sortBy: z.enum(userSortFields).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const listStoresQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  sortBy: z.enum(storeSortFields).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type ListStoresQuery = z.infer<typeof listStoresQuerySchema>;
