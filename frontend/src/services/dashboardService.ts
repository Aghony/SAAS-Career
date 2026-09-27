import type {Application, ApplicationStatus} from "../types/application.types";
import { api } from "./api";

export interface DashboardSummary {
  totalApplications: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  upcomingDeadlines: Application[];
  upcomingInterviews: Application[];
  recentApplications: Application[];
}

export const dashboardService = {
  async getSummary() {
    const res = await api.get<{ data: DashboardSummary }>("/dashboard");
    return res.data.data;
  },
};
