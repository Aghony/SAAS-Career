import type { ApplicationStatus } from "./application.types";
import type { InterviewType, InterviewStatus } from "./interview.types";

export interface MonthlyApplicationCount {
  month: string; // "YYYY-MM"
  count: number;
}

export interface TopCompany {
  company: string;
  count: number;
}

export interface AnalyticsSummary {
  applicationsOverTime: MonthlyApplicationCount[];
  statusDistribution: Record<ApplicationStatus, number>;
  offerRate: number;
  totalInterviews: number;
  interviewsByType: Record<InterviewType, number>;
  interviewsByStatus: Record<InterviewStatus, number>;
  topCompanies: TopCompany[];
}
