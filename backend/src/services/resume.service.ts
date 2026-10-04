import fs from "node:fs/promises";
import { resumeRepository } from "../repositories/resume.repository.js";
import { AppError } from "../utils/AppError.js";
import type { CreateResumeInput, UpdateResumeInput } from "../validators/resume.validator.js";

interface UploadedFileInfo {
  originalName: string;
  storedPath: string;
  size: number;
  mimeType: string;
}

async function getOwnedOrThrow(id: string, userId: string) {
  const resume = await resumeRepository.findByIdForUser(id, userId);
  if (!resume) throw new AppError(404, "RESUME_NOT_FOUND", "Resume tidak ditemukan");
  return resume;
}

export const resumeService = {
  list(userId: string) {
    return resumeRepository.findMany(userId);
  },

  getFileForDownload(id: string, userId: string) {
    return getOwnedOrThrow(id, userId);
  },

  async create(userId: string, input: CreateResumeInput, file: UploadedFileInfo) {
    const existing = await resumeRepository.findMany(userId);
    const isFirstResume = existing.length === 0;

    return resumeRepository.create({
      userId,
      label: input.label,
      fileName: file.originalName,
      filePath: file.storedPath,
      fileSize: file.size,
      mimeType: file.mimeType,
      isPrimary: isFirstResume, // resume pertama otomatis jadi primary
    });
  },

  async update(id: string, userId: string, input: UpdateResumeInput) {
    await getOwnedOrThrow(id, userId);

    if (input.isPrimary === true) {
      await resumeRepository.unsetPrimaryForUser(userId, id);
    }

    return resumeRepository.update(id, input);
  },

  async remove(id: string, userId: string) {
    const resume = await getOwnedOrThrow(id, userId);
    await resumeRepository.delete(id);

    try {
      await fs.unlink(resume.filePath);
    } catch {
      // File fisik sudah hilang duluan (misal terhapus manual) — tidak masalah, record DB tetap terhapus
    }
  },
};
