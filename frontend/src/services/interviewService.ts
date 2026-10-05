import { api } from "./api";
import type { Interview, InterviewInput } from "../types/interview.types";

export const interviewService = {
  async list(applicationId?: string) {
    const res = await api.get<{ data: { interviews: Interview[] } }>(
      "/interviews",
      {
        params: applicationId ? { applicationId } : undefined,
      },
    );
    return res.data.data.interviews;
  },
  async create(input: InterviewInput) {
    const res = await api.post<{ data: { interview: Interview } }>(
      "/interviews",
      input,
    );
    return res.data.data.interview;
  },
  async update(id: string, input: Partial<InterviewInput>) {
    const res = await api.patch<{ data: { interview: Interview } }>(
      `/interviews/${id}`,
      input,
    );
    return res.data.data.interview;
  },
  async remove(id: string) {
    await api.delete(`/interviews/${id}`);
  },
};
