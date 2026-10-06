import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", analyticsController.getSummary);

export default router;
