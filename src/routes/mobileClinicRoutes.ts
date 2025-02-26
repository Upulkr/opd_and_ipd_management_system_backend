import { Router } from "express";
import {
  createMObileClinic,
  deleteMobileClinicAssigment,
  getAllMobileClinicAssigmentsForTable,
  getAllMobileClinics,
  getCountOfCompletedMobileClinicsFor30days,
  getMothlyMobileClinicCount,
  getPatientsByage,
  updateMobileClinicAssigment,
  updateMobileClinincCompletedStatus,
} from "../controllers/mobileClinicController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.get(
  "/",
  verifyToken,
  hasPermission(["getAllMobileClinics"]),
  getAllMobileClinics
);
router.post(
  "/",
  verifyToken,
  hasPermission(["createMObileClinic"]),
  createMObileClinic
);
router.delete(
  "/",
  verifyToken,
  hasPermission(["deleteMobileClinicAssigment"]),
  deleteMobileClinicAssigment
);
router.put(
  "/id",
  verifyToken,
  hasPermission(["updateMobileClinicAssigment"]),
  updateMobileClinicAssigment
);
router.get(
  "/sheduled",
  verifyToken,
  hasPermission(["getAllMobileClinicAssigmentsForTable"]),
  getAllMobileClinicAssigmentsForTable
);
router.put(
  "/markascompleted",
  verifyToken,
  hasPermission(["updateMobileClinincCompletedStatus"]),
  updateMobileClinincCompletedStatus
);
router.get(
  "/getcountofcompletedmobileclinincs",
  verifyToken,
  hasPermission(["getCountOfCompletedMobileClinicsFor30days"]),
  getCountOfCompletedMobileClinicsFor30days
);
router.get(
  "/monthlyhomevisits",
  verifyToken,
  hasPermission(["getMothlyMobileClinicCount"]),
  getMothlyMobileClinicCount
);
router.get(
  `/getpatientsbyage`,
  verifyToken,
  hasPermission(["getPatientsByage"]),
  getPatientsByage
);

export default router;
