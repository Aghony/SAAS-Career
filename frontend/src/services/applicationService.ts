import type { Application, ApplicationInput, ApplicationListResult, ApplicationStatus } from "../types/application.types";
import { api } from "./api";

function cleanInput<T extends object>(input: T): T {
  const cleaned = { ...input } as Record<string, unknown>;
  for (const key of Object.keys(cleaned)) {
    if (cleaned[key] === "") {
      cleaned[key] = undefined;
    }
  }
  return cleaned as T;
}

export const applicationService = {
  async list(params?: { status?: ApplicationStatus; page?: number; limit?: number }) {
    const res = await api.get<{ data: ApplicationListResult }>("/applications", { params });
    return res.data.data;
  },
  async getById(id: string) {
    const res = await api.get<{ data: { application: Application } }>(`/applications/${id}`);
    return res.data.data.application;
  },
  async create(input: ApplicationInput) {
    const res = await api.post<{ data: { application: Application } }>("/applications", cleanInput(input));
    return res.data.data.application;
  },
  async update(id: string, input: Partial<ApplicationInput>) {
    const res = await api.patch<{ data: { application: Application } }>(`/applications/${id}`, cleanInput(input));
    return res.data.data.application;
  },
  async remove(id: string) {
    await api.delete(`/applications/${id}`);
  },
};