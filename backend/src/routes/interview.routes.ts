import { Router } from "express";
import { interviewController } from "../controllers/interview.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createInterviewSchema,
  updateInterviewSchema,
  listInterviewsQuerySchema,
} from "../validators/interview.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listInterviewsQuerySchema, "query"), interviewController.list);
router.post("/", validate(createInterviewSchema), interviewController.create);
router.patch("/:id", validate(updateInterviewSchema), interviewController.update);
router.delete("/:id", interviewController.remove);

export default router;
