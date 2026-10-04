import type { Request, Response } from "express";
import { projectService } from "../services/project.service.js";
import { sendSuccess } from "../utils/response.js";

export const projectController = {
  async list(req: Request, res: Response) {
    const projects = await projectService.list(req.user!.id);
    sendSuccess(res, { projects });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const project = await projectService.getById(id, req.user!.id);
    sendSuccess(res, { project });
  },

  async create(req: Request, res: Response) {
    const project = await projectService.create(req.user!.id, req.body);
    sendSuccess(res, { project }, 201);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const project = await projectService.update(id, req.user!.id, req.body);
    sendSuccess(res, { project });
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await projectService.remove(id, req.user!.id);
    sendSuccess(res, { message: "Project dihapus" });
  },
};
