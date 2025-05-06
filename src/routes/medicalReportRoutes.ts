import { Router } from "express";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

import {
  createMedicalReport,
  getMedicalReports,
  getAllMedicalReportbyNic,
  getMEdicalRportbyNicandId,
  getMedicalReportByNicandType,
} from "../controllers/medicalReportController";

router.post(
  "/",
  verifyToken,
  hasPermission(["createMedicalReport"]),
  createMedicalReport
);
router.get(
  "/",
  verifyToken,
  hasPermission(["getMedicalReports"]),
  getMedicalReports
);
router.get(
  "/getallbynic/:nic",
  verifyToken,
  hasPermission(["getAllMedicalReportbyNic"]),
  getAllMedicalReportbyNic
);
router.get(
  "/getrelated/:nic/:id",
  verifyToken,
  hasPermission(["getMEdicalRportbyNicandId"]),
  getMEdicalRportbyNicandId
);
router.get(
  "/getbynicandtype/:nic/:doctype",
  verifyToken,
  hasPermission(["getMedicalReportByNicandType"]),
  getMedicalReportByNicandType
);
export default router;
