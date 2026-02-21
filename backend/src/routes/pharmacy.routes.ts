import { Router } from "express";
import * as pharmacyController from "../controllers/pharmacy.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createPharmacySchema, updatePharmacySchema } from "../schemas/pharmacy.schema.js";

const router = Router();

router.get("/", pharmacyController.getAll);
router.get("/:id", pharmacyController.getById);
router.post("/", authenticate, validate(createPharmacySchema), pharmacyController.create);
router.put("/:id", authenticate, validate(updatePharmacySchema), pharmacyController.update);
router.delete("/:id", authenticate, pharmacyController.remove);

export default router;
