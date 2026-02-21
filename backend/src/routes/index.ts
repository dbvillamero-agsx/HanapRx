import { Router } from "express";
import authRoutes from "./auth.routes.js";
import pharmacyRoutes from "./pharmacy.routes.js";
import branchRoutes from "./branch.routes.js";
import medicineRoutes from "./medicine.routes.js";
import inventoryRoutes from "./inventory.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pharmacies", pharmacyRoutes);
router.use("/branches", branchRoutes);
router.use("/medicines", medicineRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
