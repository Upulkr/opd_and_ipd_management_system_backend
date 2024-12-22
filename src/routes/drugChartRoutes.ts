import { Router } from "express";
import {
  createDrugChart,
  deleteDrugChart,
  getAllDrugChartByNic,
  getDrugCharts,
  getrelatedDrugChart,
  updateDrugChart,
} from "../controllers/drugChartController";

const router = Router();

router.get("/", getDrugCharts);
router.get("/:nic", getAllDrugChartByNic);
router.get("/:nic/:bht", getrelatedDrugChart);
router.post("/", createDrugChart);
router.delete("/:nic", deleteDrugChart);
router.put("/:nic", updateDrugChart);

export default router;
