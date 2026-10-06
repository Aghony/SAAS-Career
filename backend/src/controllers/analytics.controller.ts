import type { Request, Response } from "express";
import { analyticsService } from "../services/analytics.service.js";
import { sendSuccess } from "../utils/response.js";

export const analyticsController = {
  async getSummary(req: Request, res: Response) {
    const summary = await analyticsService.getSummary(req.user!.id);
    sendSuccess(res, summary);
  },
};
