import { Router } from "express";
import {
  createOutPatient,
  deleteOutPatient,
  getAllOutPatients,
  getOutPatientByNic,
  updateOutPatient,
} from "../controllers/OutpatientController";

const router = Router();

router.get("/", getAllOutPatients);
router.get("/:nic", getOutPatientByNic);

router.post("/", createOutPatient);

router.delete("/:nic", deleteOutPatient);

router.put("/:nic", updateOutPatient);

export default router;
