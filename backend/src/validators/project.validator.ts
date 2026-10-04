import { z } from "zod";

const baseProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  role: z.string().max(100).optional(),
  techStack: z.array(z.string().min(1).max(50)).max(20).optional().default([]),
  projectUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isOngoing: z.boolean().optional().default(false),
});

function validDateRange(data: { startDate?: Date; endDate?: Date }) {
  return !data.startDate || !data.endDate || data.startDate <= data.endDate;
}

export const createProjectSchema = baseProjectSchema.refine(validDateRange, {
  message: "startDate tidak boleh setelah endDate",
  path: ["startDate"],
});

export const updateProjectSchema = baseProjectSchema.partial().refine(validDateRange, {
  message: "startDate tidak boleh setelah endDate",
  path: ["startDate"],
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
