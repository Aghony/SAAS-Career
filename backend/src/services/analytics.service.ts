import { analyticsRepository } from "../repositories/analytics.repository.js";
import { dashboardRepository } from "../repositories/dashboard.repository.js";
import type { ApplicationStatus, InterviewType, InterviewStatus } from "@prisma/client";

const MONTHS_BACK = 6;
const TOP_COMPANIES_LIMIT = 5;

const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "assessment",
  "interview",
  "technical_test",
  "offer",
  "rejected",
  "withdrawn",
];
const ALL_INTERVIEW_TYPES: InterviewType[] = [
  "phone_screen",
  "technical",
  "behavioral",
  "onsite",
  "final",
  "other",
];
const ALL_INTERVIEW_STATUSES: InterviewStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
  "rescheduled",
];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonthKeys(n: number) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) =>
    monthKey(new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1))
  );
}

function fillCounts<T extends string>(
  allKeys: readonly T[],
  counts: Partial<Record<T, number>>
): Record<T, number> {
  const result = {} as Record<T, number>;
  for (const key of allKeys) result[key] = counts[key] ?? 0;
  return result;
}

export const analyticsService = {
  async getSummary(userId: string) {
    const since = new Date();
    since.setMonth(since.getMonth() - (MONTHS_BACK - 1));
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const [
      monthlyRaw,
      statusGrouped,
      interviewTypeGrouped,
      interviewStatusGrouped,
      topCompaniesGrouped,
    ] = await Promise.all([
      analyticsRepository.applicationsPerMonth(userId, since),
      dashboardRepository.countByStatus(userId),
      analyticsRepository.interviewsByType(userId),
      analyticsRepository.interviewsByStatus(userId),
      analyticsRepository.topCompanies(userId, TOP_COMPANIES_LIMIT),
    ]);

    const monthlyMap: Partial<Record<string, number>> = {};
    for (const row of monthlyRaw) {
      monthlyMap[monthKey(new Date(row.month))] = row.count;
    }
    const applicationsOverTime = lastNMonthKeys(MONTHS_BACK).map((month) => ({
      month,
      count: monthlyMap[month] ?? 0,
    }));

    const statusDistribution = fillCounts(
      ALL_APPLICATION_STATUSES,
      Object.fromEntries(statusGrouped.map((g) => [g.status, g._count._all]))
    );

    const totalSubmitted = Object.entries(statusDistribution)
      .filter(([status]) => status !== "wishlist")
      .reduce((sum, [, count]) => sum + count, 0);
    const offerRate =
      totalSubmitted === 0
        ? 0
        : Math.round((statusDistribution.offer / totalSubmitted) * 1000) / 10;

    const interviewsByType = fillCounts(
      ALL_INTERVIEW_TYPES,
      Object.fromEntries(interviewTypeGrouped.map((g) => [g.type, g._count.type]))
    );
    const interviewsByStatus = fillCounts(
      ALL_INTERVIEW_STATUSES,
      Object.fromEntries(interviewStatusGrouped.map((g) => [g.status, g._count.status]))
    );
    const totalInterviews = Object.values(interviewsByStatus).reduce((a, b) => a + b, 0);

    return {
      applicationsOverTime,
      statusDistribution,
      offerRate,
      totalInterviews,
      interviewsByType,
      interviewsByStatus,
      topCompanies: topCompaniesGrouped.map((g) => ({
        company: g.company,
        count: g._count.company,
      })),
    };
  },
};
