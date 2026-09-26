import type { Request, Response } from "express";
import { applicationService } from "../services/application.service.js";
import { sendSuccess } from "../utils/response.js";
import type { ListApplicationsQuery } from "../validators/application.validator.js";

export const applicationController = {
  async list(req: Request, res: Response) {
    const query = req.validatedQuery as ListApplicationsQuery;
    const result = await applicationService.list(req.user!.id, query);
    sendSuccess(res, result);
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const application = await applicationService.getById(id, req.user!.id);
    sendSuccess(res, { application });
  },

  async create(req: Request, res: Response) {
    const application = await applicationService.create(req.user!.id, req.body);
    sendSuccess(res, { application }, 201);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const application = await applicationService.update(id, req.user!.id, req.body);
    sendSuccess(res, { application });
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await applicationService.remove(id, req.user!.id);
    sendSuccess(res, { message: "Application dihapus" });
  },
};
