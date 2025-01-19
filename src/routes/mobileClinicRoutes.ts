import { Router } from "express";
import {
  createMObileClinic,
  deleteMobileClinicAssigment,
  getAllMobileClinicAssigmentsForTable,
  getAllMobileClinics,
  updateMobileClinicAssigment,
} from "../controllers/mobileClinicController";

const router = Router();

router.get("/", getAllMobileClinics);
router.post("/", createMObileClinic);
router.delete("/", deleteMobileClinicAssigment);
router.put("/id", updateMobileClinicAssigment);
router.get("/sheduled", getAllMobileClinicAssigmentsForTable);

export default router;
