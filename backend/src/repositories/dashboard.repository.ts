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
    return prisma.interview.findMany({
      where: { userId, status: "scheduled", scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
      take,
      include: { application: { select: { company: true, position: true } } },
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
