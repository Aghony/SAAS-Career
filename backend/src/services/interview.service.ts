import { interviewRepository } from "../repositories/interview.repository.js";
import { applicationRepository } from "../repositories/application.repository.js";
import { AppError } from "../utils/AppError.js";
import type {
  CreateInterviewInput,
  UpdateInterviewInput,
  ListInterviewsQuery,
} from "../validators/interview.validator.js";

async function getOwnedOrThrow(id: string, userId: string) {
  const interview = await interviewRepository.findByIdForUser(id, userId);
  if (!interview) throw new AppError(404, "INTERVIEW_NOT_FOUND", "Interview tidak ditemukan");
  return interview;
}

export const interviewService = {
  list(userId: string, query: ListInterviewsQuery) {
    return interviewRepository.findMany(userId, { applicationId: query.applicationId });
  },

  async create(userId: string, input: CreateInterviewInput) {
    // WAJIB: pastikan applicationId yang dikirim benar-benar milik user ini,
    // bukan sekadar application yang valid di database manapun.
    const application = await applicationRepository.findByIdForUser(input.applicationId, userId);
    if (!application) {
      throw new AppError(404, "APPLICATION_NOT_FOUND", "Application tidak ditemukan");
    }
    return interviewRepository.create(userId, input);
  },

  async update(id: string, userId: string, input: UpdateInterviewInput) {
    await getOwnedOrThrow(id, userId);
    return interviewRepository.update(id, input);
  },

  async remove(id: string, userId: string) {
    await getOwnedOrThrow(id, userId);
    await interviewRepository.delete(id);
  },
};
