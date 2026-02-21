import { Router } from "express";
import * as branchController from "../controllers/branch.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBranchSchema, updateBranchSchema } from "../schemas/branch.schema.js";

const router = Router();

router.get("/", branchController.getAll);
router.get("/:id", branchController.getById);
router.post("/", authenticate, validate(createBranchSchema), branchController.create);
router.put("/:id", authenticate, validate(updateBranchSchema), branchController.update);
router.delete("/:id", authenticate, branchController.remove);

export default router;
