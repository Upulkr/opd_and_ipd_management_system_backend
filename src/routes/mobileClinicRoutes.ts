import { Router } from "express";
import {
  createMObileClinic,
  deleteMobileClinicAssigment,
  getAllMobileClinicAssigmentsForTable,
  getAllMobileClinics,
  getCountOfCompletedMobileClinicsFor30days,
  getMothlyMobileClinicCount,
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
router.get(
  "/getcountofcompletedmobileclinincs",
  getCountOfCompletedMobileClinicsFor30days
);
router.get("/monthlyhomevisits", getMothlyMobileClinicCount);

export default router;
