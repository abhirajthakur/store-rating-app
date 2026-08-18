import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z
    .string()
    .refine((val) => val.startsWith("postgres://") || val.startsWith("postgresql://"), {
      message: "DATABASE_URL must be a postgres connection string",
    }),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const env = envSchema.parse(process.env);

export default env;
