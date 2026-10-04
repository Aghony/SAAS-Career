import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", projectController.list);
router.get("/:id", projectController.getById);
router.post("/", validate(createProjectSchema), projectController.create);
router.patch("/:id", validate(updateProjectSchema), projectController.update);
router.delete("/:id", projectController.remove);

export default router;
