import { z } from "zod";

const typeEnum = z.enum(["phone_screen", "technical", "behavioral", "onsite", "final", "other"]);
const statusEnum = z.enum(["scheduled", "completed", "cancelled", "rescheduled"]);

export const createInterviewSchema = z.object({
  applicationId: z.string().uuid(),
  type: typeEnum,
  status: statusEnum.optional(),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.number().int().positive().max(1440).optional(),
  location: z.string().max(300).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateInterviewSchema = createInterviewSchema.omit({ applicationId: true }).partial();

export const listInterviewsQuerySchema = z.object({
  applicationId: z.string().uuid().optional(),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type ListInterviewsQuery = z.infer<typeof listInterviewsQuerySchema>;
