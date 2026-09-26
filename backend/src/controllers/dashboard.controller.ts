import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/response.js";

export const dashboardController = {
  async getSummary(req: Request, res: Response) {
    const summary = await   dashboardService.getSummary(req.user!.id);
    sendSuccess(res, summary);
  },
};
