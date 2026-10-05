export type SkillCategory =
  | "language"
  | "framework"
  | "tool"
  | "platform"
  | "soft_skill"
  | "other";
export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SkillInput {
  name: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  "language",
  "framework",
  "tool",
  "platform",
  "soft_skill",
  "other",
];
export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  language: "Language",
  framework: "Framework",
  tool: "Tool",
  platform: "Platform",
  soft_skill: "Soft Skill",
  other: "Other",
};

export const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];
export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};
