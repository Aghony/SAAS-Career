import { prisma } from "../config/prisma.js";

export const dashboardRepository = {
  countTotal(userId: string) {
    return prisma.application.count({ where: { userId } });
  },

  countByStatus(userId: string) {
    return prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    });
  },

  upcomingDeadlines(userId: string, take: number) {
    return prisma.application.findMany({
      where: { userId, deadline: { gte: new Date() } },
      orderBy: { deadline: "asc" },
      take,
    });
  },

  upcomingInterviews(userId: string, take: number) {
    return prisma.application.findMany({
      where: {
        userId,
        status: { in: ["interview", "technical_test"] },
        deadline: { gte: new Date() },
      },
      orderBy: { deadline: "asc" },
      take,
    });
  },

  recentApplications(userId: string, take: number) {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
  },
};
