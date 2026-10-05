import { api } from "./api";
import type { Skill, SkillInput } from "../types/skill.types";

export const skillService = {
  async list() {
    const res = await api.get<{ data: { skills: Skill[] } }>("/skills");
    return res.data.data.skills;
  },
  async create(input: SkillInput) {
    const res = await api.post<{ data: { skill: Skill } }>("/skills", input);
    return res.data.data.skill;
  },
  async update(id: string, input: Partial<SkillInput>) {
    const res = await api.patch<{ data: { skill: Skill } }>(
      `/skills/${id}`,
      input,
    );
    return res.data.data.skill;
  },
  async remove(id: string) {
    await api.delete(`/skills/${id}`);
  },
};
