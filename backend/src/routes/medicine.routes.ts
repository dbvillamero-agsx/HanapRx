import { Router } from "express";
import * as medicineController from "../controllers/medicine.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createMedicineSchema, updateMedicineSchema } from "../schemas/medicine.schema.js";

const router = Router();

router.get("/search", medicineController.search);
router.get("/autocomplete", medicineController.autocomplete);
router.get("/", medicineController.getAll);
router.get("/:id", medicineController.getById);
router.post("/", authenticate, validate(createMedicineSchema), medicineController.create);
router.put("/:id", authenticate, validate(updateMedicineSchema), medicineController.update);
router.delete("/:id", authenticate, medicineController.remove);

export default router;
