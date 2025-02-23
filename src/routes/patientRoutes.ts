import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatientByNic,
  isPatientExist,
  updatePatient,
} from "../controllers/patientController";
import { getAllPatients } from "../controllers/patientController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
const router = Router();
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
router.get("/", verifyToken, hasPermission(["getAllPatients"]), getAllPatients);

router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getPatientByNic"]),
  getPatientByNic
);

router.post("/", verifyToken, hasPermission(["createPatient"]), createPatient);

router.delete(
  "/:nic",
  verifyToken,
  hasPermission(["deletePatient"]),
  deletePatient
);

router.put(
  "/:nic",
  verifyToken,
  hasPermission(["updatePatient"]),
  updatePatient
);

router.get(
  "/isPatientexist/:nic",
  verifyToken,
  hasPermission(["isPatientExist"]),
  isPatientExist
);

export default router;
