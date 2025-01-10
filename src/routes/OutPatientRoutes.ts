import { Router } from "express";
import { createOutPatient } from "../controllers/OutPatientController"; // Ensure the casing matches the actual file name

const router = Router();

router.post("/", createOutPatient);

export default router;
