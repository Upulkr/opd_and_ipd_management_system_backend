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

/**
 * @route GET /
 * @description Get all drug charts
 * @access Protected
 * @permission getDrugCharts
 */
router.get("/", verifyToken, hasPermission(["getDrugCharts"]), getDrugCharts);

/**
 * @route GET /:nic
 * @description Get all drug charts by NIC
 * @access Protected
 * @permission getAllDrugChartByNic
 */
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getAllDrugChartByNic"]),
  getAllDrugChartByNic,
);

/**
 * @route GET /:nic/:bht
 * @description Get related drug chart
 * @access Protected
 * @permission getrelatedDrugChart
 */
router.get(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["getrelatedDrugChart"]),
  getrelatedDrugChart,
);

/**
 * @route POST /
 * @description Create a new drug chart
 * @access Protected
 * @permission createDrugChart
 */
router.post(
  "/",
  verifyToken,
  hasPermission(["createDrugChart"]),
  createDrugChart,
);

/**
 * @route DELETE /:nic
 * @description Delete a drug chart
 * @access Protected
 * @permission deleteDrugChart
 */
router.delete(
  "/:nic",
  verifyToken,
  hasPermission(["deleteDrugChart"]),
  deleteDrugChart,
);

/**
 * @route PUT /:nic
 * @description Update a drug chart
 * @access Protected
 * @permission updateDrugChart
 */
router.put(
  "/:nic",
  verifyToken,
  hasPermission(["updateDrugChart"]),
  updateDrugChart,
);

export default router;
