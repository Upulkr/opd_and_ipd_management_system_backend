import { Router } from "express";
import {
  createMObileClinic,
  deleteMobileClinicAssigment,
  getAllMobileClinicAssigmentsForTable,
  getAllMobileClinics,
  updateMobileClinicAssigment,
  updateMobileClinincCompletedStatus,
} from "../controllers/mobileClinicController";

const router = Router();

router.get("/", getAllMobileClinics);
router.post("/", createMObileClinic);
router.delete("/", deleteMobileClinicAssigment);
router.put("/id", updateMobileClinicAssigment);
router.get("/sheduled", getAllMobileClinicAssigmentsForTable);
router.put("/markascompleted", updateMobileClinincCompletedStatus);

export default router;
