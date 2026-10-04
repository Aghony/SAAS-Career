import type { Request, Response } from "express";
import { resumeService } from "../services/resume.service.js";
import { sendSuccess } from "../utils/response.js";
import { toResumeDto } from "../utils/toResumeDto.js";
import { AppError } from "../utils/AppError.js";

export const resumeController = {
  async list(req: Request, res: Response) {
    const resumes = await resumeService.list(req.user!.id);
    sendSuccess(res, { resumes: resumes.map(toResumeDto) });
  },

  async create(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(400, "FILE_REQUIRED", "File PDF wajib diunggah");
    }

    const resume = await resumeService.create(req.user!.id, req.body, {
      originalName: req.file.originalname,
      storedPath: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    sendSuccess(res, { resume: toResumeDto(resume) }, 201);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const resume = await resumeService.update(id, req.user!.id, req.body);
    sendSuccess(res, { resume: toResumeDto(resume) });
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await resumeService.remove(id, req.user!.id);
    sendSuccess(res, { message: "Resume dihapus" });
  },

  async download(req: Request, res: Response) {
    const id = req.params.id as string;
    const resume = await resumeService.getFileForDownload(id, req.user!.id);
    res.download(resume.filePath, resume.fileName);
  },
};
