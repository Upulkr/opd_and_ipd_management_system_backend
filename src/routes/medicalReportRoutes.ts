import { Router } from "express";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import {
  createMedicalReport,
  getMedicalReports,
  getAllMedicalReportbyNic,
  getMEdicalRportbyNicandId,
  getMedicalReportByNicandType,
} from "../controllers/medicalReportController";

const router = Router();

// Destructure middleware for cleaner usage
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;

/**
 * Route: POST /
 * Description: Create a new medical report.
 * Protection: Requires valid token and 'createMedicalReport' permission.
 */
router.post(
  "/",
  verifyToken,
  hasPermission(["createMedicalReport"]),
  createMedicalReport,
);

/**
 * Route: GET /
 * Description: Retrieve all medical reports.
 * Protection: Requires valid token and 'getMedicalReports' permission.
 */
router.get(
  "/",
  verifyToken,
  hasPermission(["getMedicalReports"]),
  getMedicalReports,
);

/**
 * Route: GET /getallbynic/:nic
 * Description: Retrieve all medical reports for a specific patient by NIC.
 * Protection: Requires valid token and 'getAllMedicalReportbyNic' permission.
 */
router.get(
  "/getallbynic/:nic",
  verifyToken,
  hasPermission(["getAllMedicalReportbyNic"]),
  getAllMedicalReportbyNic,
);

/**
 * Route: GET /getrelated/:nic/:id
 * Description: Retrieve a specific medical report by NIC and Report ID.
 * Protection: Requires valid token and 'getMEdicalRportbyNicandId' permission.
 */
router.get(
  "/getrelated/:nic/:id",
  verifyToken,
  hasPermission(["getMEdicalRportbyNicandId"]),
  getMEdicalRportbyNicandId,
);

/**
 * Route: GET /getbynicandtype/:nic/:doctype
 * Description: Retrieve medical reports by NIC and document type.
 * Protection: Requires valid token and 'getMedicalReportByNicandType' permission.
 */
router.get(
  "/getbynicandtype/:nic/:doctype",
  verifyToken,
  hasPermission(["getMedicalReportByNicandType"]),
  getMedicalReportByNicandType,
);

export default router;
