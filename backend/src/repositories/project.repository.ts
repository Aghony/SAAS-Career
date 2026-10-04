import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const projectRepository = {
  findMany(userId: string) {
    return prisma.project.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.project.findFirst({ where: { id, userId } });
  },
  create(userId: string, data: Omit<Prisma.ProjectUncheckedCreateInput, "userId" | "id">) {
    return prisma.project.create({ data: { ...data, userId } });
  },
  update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
