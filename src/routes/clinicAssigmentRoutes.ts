import { Router } from "express";
import {
  createClinicAssigment,
  deleteClinicAssigment,
  getAllClinicAssigments,
  getAllClinicAssigmentsForTable,
  getPatientDetailsByClinicName,
  updateClinicAssigment,
} from "../controllers/clinicAssigmnentController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.get(
  "/",
  verifyToken,
  hasPermission(["getAllClinicAssigments"]),
  getAllClinicAssigments
);
router.post(
  "/",
  verifyToken,
  hasPermission(["createClinicAssigment"]),
  createClinicAssigment
);
router.put(
  "/:id",
  verifyToken,
  hasPermission(["updateClinicAssigment"]),
  updateClinicAssigment
);
router.delete(
  "/:id",
  verifyToken,
  hasPermission(["deleteClinicAssigment"]),
  deleteClinicAssigment
);

router.get(
  "/getAllClinicAssigmentsfortable",
  verifyToken,
  hasPermission(["getAllClinicAssigmentsForTable"]),
  getAllClinicAssigmentsForTable
);
router.get(
  "/getPatientDetailsByClinicName/:clinicName",
  verifyToken,
  hasPermission(["getPatientDetailsByClinicName"]),
  getPatientDetailsByClinicName
);

export default router;
