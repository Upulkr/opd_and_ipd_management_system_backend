import { Router } from "express";
import {
  createOutPatient,
  getAllOutPatientsToday,
  getOutPatientByNic,
  getStaffMemebers,
} from "../controllers/OutPatientController"; // Ensure the casing matches the actual file name

const router = Router();
router.get("/getstaff", getStaffMemebers);
router.post("/", createOutPatient);
router.get("/", getAllOutPatientsToday);
router.get("/:nic", getOutPatientByNic);

export default router;
