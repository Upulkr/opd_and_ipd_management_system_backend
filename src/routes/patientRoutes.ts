import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatientByNic,
  updatePatient,
} from "../controllers/patientController";
import { getAllPatients } from "../controllers/userController";

const router = Router();

router.get("/", getAllPatients);
router.get("/:nic", getPatientByNic);

router.post("/", createPatient);

router.delete("/:nic", deletePatient);

router.put("/:nic", updatePatient);

export default router;
