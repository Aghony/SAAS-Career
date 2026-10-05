import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const skillRepository = {
  findMany(userId: string) {
    return prisma.skill.findMany({ where: { userId }, orderBy: [{ category: "asc" }, { name: "asc" }] });
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.skill.findFirst({ where: { id, userId } });
  },
  findByNameForUser(name: string, userId: string) {
    return prisma.skill.findFirst({ where: { userId, name } });
  },
  create(userId: string, data: Omit<Prisma.SkillUncheckedCreateInput, "userId" | "id">) {
    return prisma.skill.create({ data: { ...data, userId } });
  },
  update(id: string, data: Prisma.SkillUpdateInput) {
    return prisma.skill.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  },
};