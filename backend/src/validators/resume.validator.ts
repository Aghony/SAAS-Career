import { z } from "zod";

export const createResumeSchema = z.object({
  label: z.string().min(1).max(100),
});

export const updateResumeSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  isPrimary: z.boolean().optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;