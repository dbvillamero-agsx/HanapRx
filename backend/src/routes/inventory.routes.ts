import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createInventorySchema, updateInventorySchema } from "../schemas/inventory.schema.js";

const router = Router();

router.get("/", inventoryController.getAll);
router.get("/:id", inventoryController.getById);
router.post("/", authenticate, validate(createInventorySchema), inventoryController.create);
router.put("/:id", authenticate, validate(updateInventorySchema), inventoryController.update);
router.delete("/:id", authenticate, inventoryController.remove);

export default router;
