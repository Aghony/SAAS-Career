import { skillRepository } from "../repositories/skill.repository.js";
import { AppError } from "../utils/AppError.js";
import type { CreateSkillInput, UpdateSkillInput } from "../validators/skill.validator.js";

async function getOwnedOrThrow(id: string, userId: string) {
  const skill = await skillRepository.findByIdForUser(id, userId);
  if (!skill) throw new AppError(404, "SKILL_NOT_FOUND", "Skill tidak ditemukan");
  return skill;
}

export const skillService = {
  list(userId: string) {
    return skillRepository.findMany(userId);
  },

  async create(userId: string, input: CreateSkillInput) {
    const existing = await skillRepository.findByNameForUser(input.name, userId);
    if (existing)
      throw new AppError(409, "SKILL_ALREADY_EXISTS", "Skill ini sudah ada di daftar Anda");
    return skillRepository.create(userId, input);
  },

  async update(id: string, userId: string, input: UpdateSkillInput) {
    const skill = await getOwnedOrThrow(id, userId);

    if (input.name && input.name !== skill.name) {
      const existing = await skillRepository.findByNameForUser(input.name, userId);
      if (existing)
        throw new AppError(409, "SKILL_ALREADY_EXISTS", "Skill ini sudah ada di daftar Anda");
    }

    return skillRepository.update(id, input);
  },

  async remove(id: string, userId: string) {
    await getOwnedOrThrow(id, userId);
    await skillRepository.delete(id);
  },
};
