import { z } from "zod";

export const createPharmacySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  logoUrl: z.string().url().optional().nullable(),
});

export const updatePharmacySchema = createPharmacySchema.partial();

export type CreatePharmacyInput = z.infer<typeof createPharmacySchema>;
export type UpdatePharmacyInput = z.infer<typeof updatePharmacySchema>;
