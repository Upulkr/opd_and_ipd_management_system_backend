import { Router } from "express";
import {
  createOutPatient,
  getAllOutPatientsToday,
  getOutPatientByNic,
} from "../controllers/OutPatientController"; // Ensure the casing matches the actual file name

const router = Router();

router.post("/", createOutPatient);
router.get("/", getAllOutPatientsToday);
router.get("/:nic", getOutPatientByNic);

export default router;
