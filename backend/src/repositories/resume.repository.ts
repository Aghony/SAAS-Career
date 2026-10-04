import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const resumeRepository = {
  findMany(userId: string) {
    return prisma.resume.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.resume.findFirst({ where: { id, userId } });
  },
  create(data: Prisma.ResumeUncheckedCreateInput) {
    return prisma.resume.create({ data });
  },
  update(id: string, data: Prisma.ResumeUpdateInput) {
    return prisma.resume.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.resume.delete({ where: { id } });
  },
  unsetPrimaryForUser(userId: string, excludeId: string) {
    return prisma.resume.updateMany({
      where: { userId, id: { not: excludeId }, isPrimary: true },
      data: { isPrimary: false },
    });
  },
};
