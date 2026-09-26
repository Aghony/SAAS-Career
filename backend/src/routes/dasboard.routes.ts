import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { dashboardController } from "../controllers/dashboard.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", dashboardController.getSummary);

export default router;