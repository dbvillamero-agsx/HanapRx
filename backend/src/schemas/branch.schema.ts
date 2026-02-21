import { z } from "zod";

export const createBranchSchema = z.object({
  pharmacyId: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(255),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contactNumber: z.string().optional().nullable(),
  businessHours: z.string().optional().nullable(),
});

export const updateBranchSchema = createBranchSchema.partial();

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
