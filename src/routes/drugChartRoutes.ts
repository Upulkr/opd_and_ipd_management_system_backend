import { Router } from "express";
import {
  createDrugChart,
  deleteDrugChart,
  getAllDrugChartByNic,
  getDrugCharts,
  getrelatedDrugChart,
  updateDrugChart,
} from "../controllers/drugChartController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.get("/", verifyToken, hasPermission(["getDrugCharts"]), getDrugCharts);
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getAllDrugChartByNic"]),
  getAllDrugChartByNic
);
router.get(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["getrelatedDrugChart"]),
  getrelatedDrugChart
);
router.post(
  "/",
  verifyToken,
  hasPermission(["createDrugChart"]),
  createDrugChart
);
router.delete(
  "/:nic",
  verifyToken,
  hasPermission(["deleteDrugChart"]),
  deleteDrugChart
);
router.put(
  "/:nic",
  verifyToken,
  hasPermission(["updateDrugChart"]),
  updateDrugChart
);

export default router;
