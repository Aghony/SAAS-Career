import { applicationRepository } from "../repositories/application.repository.js";
import { AppError } from "../utils/AppError.js";
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
  ListApplicationsQuery,
} from "../validators/application.validator.js";

async function getOwnedOrThrow(id: string, userId: string) {
  const application = await applicationRepository.findByIdForUser(id, userId);
  if (!application) {
    throw new AppError(404, "APPLICATION_NOT_FOUND", "Application tidak ditemukan");
  }
  return application;
}

export const applicationService = {
  async list(userId: string, query: ListApplicationsQuery) {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      applicationRepository.findMany(userId, { status: query.status }, skip, query.limit),
      applicationRepository.count(userId, { status: query.status }),
    ]);
    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  getById(id: string, userId: string) {
    return getOwnedOrThrow(id, userId);
  },

  create(userId: string, input: CreateApplicationInput) {
    return applicationRepository.create(userId, input);
  },

  async update(id: string, userId: string, input: UpdateApplicationInput) {
    await getOwnedOrThrow(id, userId);
    return applicationRepository.update(id, input);
  },

  async remove(id: string, userId: string) {
    await getOwnedOrThrow(id, userId);
    await applicationRepository.delete(id);
  },
};
