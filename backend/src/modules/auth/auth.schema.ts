import { z } from "zod";

const password = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/, "Must contain special character");

export const registerSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.email("Invalid email address"),
  address: z.string().max(400),
  password,
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: password,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
