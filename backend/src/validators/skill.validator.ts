import { z } from "zod";

const categoryEnum = z.enum(["language", "framework", "tool", "platform", "soft_skill", "other"]);
const proficiencyEnum = z.enum(["beginner", "intermediate", "advanced", "expert"]);

export const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: categoryEnum,
  proficiencyLevel: proficiencyEnum,
  yearsOfExperience: z.number().int().nonnegative().max(60).optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
