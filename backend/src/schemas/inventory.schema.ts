import { z } from "zod";

export const createInventorySchema = z.object({
  branchId: z.number().int().positive(),
  medicineId: z.number().int().positive(),
  stockCount: z.number().int().min(0),
  price: z.number().positive("Price must be positive"),
});

export const updateInventorySchema = z.object({
  stockCount: z.number().int().min(0).optional(),
  price: z.number().positive("Price must be positive").optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
