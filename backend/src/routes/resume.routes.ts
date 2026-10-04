import { Router } from "express";
import { resumeController } from "../controllers/resume.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadResume } from "../middlewares/resume.middleware.js";
import { createResumeSchema, updateResumeSchema } from "../validators/resume.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", resumeController.list);
router.get("/:id/download", resumeController.download);
router.post("/", uploadResume, validate(createResumeSchema), resumeController.create);
router.patch("/:id", validate(updateResumeSchema), resumeController.update);
router.delete("/:id", resumeController.remove);

export default router;
