import { Router } from "express";
import {
  createOutPatient,
  getAllOutPatientsToday,
} from "../controllers/OutPatientController"; // Ensure the casing matches the actual file name

const router = Router();

router.post("/", createOutPatient);
router.get("/", getAllOutPatientsToday);

export default router;
