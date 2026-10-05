import type { Request, Response } from "express";
import { skillService } from "../services/skill.service.js";
import { sendSuccess } from "../utils/response.js";

export const skillController = {
  async list(req: Request, res: Response) {
    const skills = await skillService.list(req.user!.id);
    sendSuccess(res, { skills });
  },

  async create(req: Request, res: Response) {
    const skill = await skillService.create(req.user!.id, req.body);
    sendSuccess(res, { skill }, 201);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const skill = await skillService.update(id, req.user!.id, req.body);
    sendSuccess(res, { skill });
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await skillService.remove(id, req.user!.id);
    sendSuccess(res, { message: "Skill dihapus" });
  },
};
