import { z } from "zod";

const storeSortFields = ["name", "address", "rating"] as const;

export const listStoresQuerySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  sortBy: z.enum(storeSortFields).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const submitRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

export type ListStoresQuery = z.infer<typeof listStoresQuerySchema>;
export type SubmitRatingInput = z.infer<typeof submitRatingSchema>;
