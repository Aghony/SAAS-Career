import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

const APPLICATION_SUMMARY = { id: true, company: true, position: true } as const;

export const interviewRepository = {
  findMany(userId: string, filters: { applicationId?: string }) {
    return prisma.interview.findMany({
      where: { userId, applicationId: filters.applicationId },
      orderBy: { scheduledAt: "desc" },
      include: { application: { select: APPLICATION_SUMMARY } },
    });
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.interview.findFirst({
      where: { id, userId },
      include: { application: { select: APPLICATION_SUMMARY } },
    });
  },
  create(userId: string, data: Omit<Prisma.InterviewUncheckedCreateInput, "userId" | "id">) {
    return prisma.interview.create({
      data: { ...data, userId },
      include: { application: { select: APPLICATION_SUMMARY } },
    });
  },
  update(id: string, data: Prisma.InterviewUpdateInput) {
    return prisma.interview.update({
      where: { id },
      data,
      include: { application: { select: APPLICATION_SUMMARY } },
    });
  },
  delete(id: string) {
    return prisma.interview.delete({ where: { id } });
  },
};
