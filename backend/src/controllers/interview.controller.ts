import type { Request, Response } from "express";
import { interviewService } from "../services/interview.service.js";
import { sendSuccess } from "../utils/response.js";
import type { ListInterviewsQuery } from "../validators/interview.validator.js";

export const interviewController = {
  async list(req: Request, res: Response) {
    const query = req.validatedQuery as ListInterviewsQuery;
    const interviews = await interviewService.list(req.user!.id, query);
    sendSuccess(res, { interviews });
  },

  async create(req: Request, res: Response) {
    const interview = await interviewService.create(req.user!.id, req.body);
    sendSuccess(res, { interview }, 201);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const interview = await interviewService.update(id, req.user!.id, req.body);
    sendSuccess(res, { interview });
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await interviewService.remove(id, req.user!.id);
    sendSuccess(res, { message: "Interview dihapus" });
  },
};
