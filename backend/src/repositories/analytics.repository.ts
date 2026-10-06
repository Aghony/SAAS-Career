import { prisma } from "../config/prisma.js";

export const analyticsRepository = {
  applicationsPerMonth(userId: string, since: Date) {
    return prisma.$queryRaw<{ month: Date; count: number }[]>`
      SELECT date_trunc('month', "createdAt") as month, COUNT(*)::int as count
      FROM "Application"
      WHERE "userId" = ${userId} AND "createdAt" >= ${since}
      GROUP BY month
      ORDER BY month ASC
    `;
  },

  interviewsByType(userId: string) {
    return prisma.interview.groupBy({
      by: ["type"],
      where: { userId },
      _count: { type: true },
    });
  },

  interviewsByStatus(userId: string) {
    return prisma.interview.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    });
  },

  topCompanies(userId: string, limit: number) {
    return prisma.application.groupBy({
      by: ["company"],
      where: { userId },
      _count: { company: true },
      orderBy: { _count: { company: "desc" } },
      take: limit,
    });
  },
};