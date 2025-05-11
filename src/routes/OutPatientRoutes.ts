import { Router } from "express";
import {
  createOutPatient,
  getAllOutPatientsToday,
  getNumberOfOutPatientsToday,
  getOutPatientByNic,
  getStaffMemebers,
} from "../controllers/OutpatientController"; // Ensure the casing matches the actual file name
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();
router.get(
  "/getstaff",
  verifyToken,
  hasPermission(["getStaffMemebers"]),
  getStaffMemebers
);
router.post(
  "/",
  verifyToken,
  hasPermission(["createOutPatient"]),
  createOutPatient
);
router.get(
  "/",
  verifyToken,
  hasPermission(["getAllOutPatientsToday"]),
  getAllOutPatientsToday
);
router.get(
  "/outpatientscount",

  getNumberOfOutPatientsToday
);
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getOutPatientByNic"]),
  getOutPatientByNic
);

export default router;
