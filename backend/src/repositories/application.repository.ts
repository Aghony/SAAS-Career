import { prisma } from "../config/prisma.js";
import type { ApplicationStatus, Prisma } from "@prisma/client";

interface ListFilters {
  status?: ApplicationStatus;
}

export const applicationRepository = {
  findMany(userId: string, filters: ListFilters, skip: number, take: number) {
    return prisma.application.findMany({
      where: { userId, status: filters.status },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },
  count(userId: string, filters: ListFilters) {
    return prisma.application.count({ where: { userId, status: filters.status } });
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.application.findFirst({ where: { id, userId } });
  },
  create(userId: string, data: Omit<Prisma.ApplicationUncheckedCreateInput, "userId" | "id">) {
    return prisma.application.create({ data: { ...data, userId } });
  },
  update(id: string, data: Prisma.ApplicationUpdateInput) {
    return prisma.application.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.application.delete({ where: { id } });
  },
};
