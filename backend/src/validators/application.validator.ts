import { z } from "zod";

const employmentTypeEnum = z.enum([
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
]);
const statusEnum = z.enum([
  "wishlist",
  "applied",
  "assessment",
  "interview",
  "technical_test",
  "offer",
  "rejected",
  "withdrawn",
]);

const baseApplicationSchema = z.object({
  company: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  jobUrl: z.string().url().optional(),
  location: z.string().max(200).optional(),
  employmentType: employmentTypeEnum.optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  appliedAt: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  status: statusEnum.optional(),
  notes: z.string().max(5000).optional(),
});

function validSalaryRange(data: { salaryMin?: number; salaryMax?: number }) {
  return !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax;
}

export const createApplicationSchema = baseApplicationSchema.refine(validSalaryRange, {
  message: "salaryMin tidak boleh lebih besar dari salaryMax",
  path: ["salaryMin"],
});

export const updateApplicationSchema = baseApplicationSchema.partial().refine(validSalaryRange, {
  message: "salaryMin tidak boleh lebih besar dari salaryMax",
  path: ["salaryMin"],
});

export const listApplicationsQuerySchema = z.object({
  status: statusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
