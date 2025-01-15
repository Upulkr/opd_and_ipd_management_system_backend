import { Router } from "express";
import {
  createClinicAssigment,
  deleteClinicAssigment,
  getAllClinicAssigments,
  getAllClinicAssigmentsForTable,
  getPatientDetailsByClinicName,
  updateClinicAssigment,
} from "../controllers/clinicAssigmnentController";

const router = Router();

router.get("/", getAllClinicAssigments);
router.post("/", createClinicAssigment);
router.put("/:id", updateClinicAssigment);
router.delete("/:id", deleteClinicAssigment);

router.get("/getAllClinicAssigmentsfortable", getAllClinicAssigmentsForTable);
router.get(
  "/getPatientDetailsByClinicName/:clinicName",
  getPatientDetailsByClinicName
);

export default router;
