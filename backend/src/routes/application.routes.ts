import { Router } from "express";
import { applicationController } from "../controllers/application.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
  listApplicationsQuerySchema,
} from "../validators/application.validator.js";

const router = Router();

router.use(requireAuth); // semua route di bawah ini wajib login

router.get("/", validate(listApplicationsQuerySchema, "query"), applicationController.list);
router.get("/:id", applicationController.getById);
router.post("/", validate(createApplicationSchema), applicationController.create);
router.patch("/:id", validate(updateApplicationSchema), applicationController.update);
router.delete("/:id", applicationController.remove);

export default router;
