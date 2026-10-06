import { api } from "./api";
import type { AnalyticsSummary } from "../types/analytics.types";

export const analyticsService = {
  async getSummary() {
    const res = await api.get<{ data: AnalyticsSummary }>("/analytics");
    return res.data.data;
  },
};
