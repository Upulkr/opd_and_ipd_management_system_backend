import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatientByNic,
  isPatientExist,
  updatePatient,
} from "../controllers/patientController";
import { getAllPatients } from "../controllers/patientController";

const router = Router();

router.get("/", getAllPatients);
router.get("/:nic", getPatientByNic);

router.post("/", createPatient);

router.delete("/:nic", deletePatient);

router.put("/:nic", updatePatient);

router.get("/isPatientexist/:nic", isPatientExist);

export default router;
