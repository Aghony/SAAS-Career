import { api } from "./api";
import type {
  Application,
  ApplicationStatus,
} from "../types/application.types";
import type { Interview } from "../types/interview.types";
export interface DashboardSummary {
  totalApplications: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  upcomingDeadlines: Application[];
  upcomingInterviews: Interview[];
  recentApplications: Application[];
}

export const dashboardService = {
  async getSummary() {
    const res = await api.get<{ data: DashboardSummary }>("/dashboard");
    return res.data.data;
  },
};
