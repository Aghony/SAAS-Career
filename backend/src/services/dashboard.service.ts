import { ApplicationStatus } from "@prisma/client";
import { dashboardRepository } from "../repositories/dashboard.repository.js";

const ALL_STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "assessment",
  "interview",
  "technical_test",
  "offer",
  "rejected",
  "withdrawn",
];

const UPCOMING_LIMIT = 5;
const RECENT_LIMIT = 5;

function buildStatusBreakdown(grouped: { status: ApplicationStatus; _count: { _all: number } }[]) {
  const breakdown = Object.fromEntries(ALL_STATUSES.map((status) => [status, 0])) as Record<
    ApplicationStatus,
    number
  >;

  for (const group of grouped) {
    breakdown[group.status] = group._count._all;
  }
  return breakdown;
}

export const dashboardService = {
  async getSummary(userId: string) {
    const [total, grouped, upcomingDeadlines, upcomingInterviews, recentApplications] =
    await Promise.all([
      dashboardRepository.countTotal(userId),
      dashboardRepository.countByStatus(userId),
      dashboardRepository.upcomingDeadlines(userId, UPCOMING_LIMIT),
      dashboardRepository.upcomingInterviews(userId, UPCOMING_LIMIT),
      dashboardRepository.recentApplications(userId, RECENT_LIMIT),
    ]);

    return {
        totalApplication: total,
        statusBreakdown: buildStatusBreakdown(grouped),
        upcomingDeadlines,
        upcomingInterviews,
        recentApplications,
    }
  },
};
