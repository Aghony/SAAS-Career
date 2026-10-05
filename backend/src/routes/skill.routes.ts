import { Router } from "express";
import { skillController } from "../controllers/skill.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSkillSchema, updateSkillSchema } from "../validators/skill.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", skillController.list);
router.post("/", validate(createSkillSchema), skillController.create);
router.patch("/:id", validate(updateSkillSchema), skillController.update);
router.delete("/:id", skillController.remove);

export default router;