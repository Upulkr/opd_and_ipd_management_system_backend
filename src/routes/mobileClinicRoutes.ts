import { Router } from "express";
import {
  createMObileClinic,
  deleteMobileClinicAssigment,
  getAllMobileClinicAssigmentsForTable,
  getAllMobileClinics,
  getCountOfCompletedMobileClinicsFor30days,
  getMothlyMobileClinicCount,
  getPatientsByage,
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
router.get(`/getpatientsbyage`, getPatientsByage);

export default router;
