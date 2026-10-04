import { projectRepository } from "../repositories/project.repository.js";
import { AppError } from "../utils/AppError.js";
import type { CreateProjectInput, UpdateProjectInput } from "../validators/project.validator.js";

async function getOwnedOrThrow(id: string, userId: string) {
  const project = await projectRepository.findByIdForUser(id, userId);
  if (!project) throw new AppError(404, "PROJECT_NOT_FOUND", "Project tidak ditemukan");
  return project;
}

function normalizeOngoing<T extends { isOngoing?: boolean; endDate?: Date }>(input: T): T {
  if (input.isOngoing === true) {
    return { ...input, endDate: undefined };
  }
  return input;
}

export const projectService = {
  list(userId: string) {
    return projectRepository.findMany(userId);
  },

  getById(id: string, userId: string) {
    return getOwnedOrThrow(id, userId);
  },

  create(userId: string, input: CreateProjectInput) {
    return projectRepository.create(userId, normalizeOngoing(input));
  },

  async update(id: string, userId: string, input: UpdateProjectInput) {
    await getOwnedOrThrow(id, userId);
    return projectRepository.update(id, normalizeOngoing(input));
  },

  async remove(id: string, userId: string) {
    await getOwnedOrThrow(id, userId);
    await projectRepository.delete(id);
  },
};
