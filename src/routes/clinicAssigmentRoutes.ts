import { Router } from "express";
import {
  createClinicAssigment,
  deleteClinicAssigment,
  getAllClinicAssigments,
  getAllClinicAssigmentsForTable,
  getPatientDetailsByClinicName,
  getWeeklyClinincVisits,
  updateClinicAssigment,
} from "../controllers/clinicAssigmnentController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

/**
 * @route GET /getWeeklyclinincvisits
 * @description Get weekly clinic visits stats
 * @access Public
 */
router.get("/getWeeklyclinincvisits", getWeeklyClinincVisits);

/**
 * @route GET /
 * @description Get all clinic assignments
 * @access Protected
 * @permission getAllClinicAssigments
 */
router.get(
  "/",
  verifyToken,
  hasPermission(["getAllClinicAssigments"]),
  getAllClinicAssigments,
);

/**
 * @route POST /
 * @description Create a new clinic assignment
 * @access Protected
 * @permission createClinicAssigment
 */
router.post(
  "/",
  verifyToken,
  hasPermission(["createClinicAssigment"]),
  createClinicAssigment,
);

/**
 * @route PUT /:id
 * @description Update a clinic assignment
 * @access Protected
 * @permission updateClinicAssigment
 */
router.put(
  "/:id",
  verifyToken,
  hasPermission(["updateClinicAssigment"]),
  updateClinicAssigment,
);

/**
 * @route DELETE /:id
 * @description Delete a clinic assignment
 * @access Protected
 * @permission deleteClinicAssigment
 */
router.delete(
  "/:id",
  verifyToken,
  hasPermission(["deleteClinicAssigment"]),
  deleteClinicAssigment,
);

/**
 * @route GET /getallclinicassigmentsfortable
 * @description Get all clinic assignments for table view
 * @access Protected
 * @permission getAllClinicAssigmentsForTable
 */
router.get(
  "/getallclinicassigmentsfortable",
  verifyToken,
  hasPermission(["getAllClinicAssigmentsForTable"]),
  getAllClinicAssigmentsForTable,
);

/**
 * @route GET /getPatientDetailsByClinicName/:clinicName
 * @description Get patient details by clinic name
 * @access Protected
 * @permission getPatientDetailsByClinicName
 */
router.get(
  "/getPatientDetailsByClinicName/:clinicName",
  verifyToken,
  hasPermission(["getPatientDetailsByClinicName"]),
  getPatientDetailsByClinicName,
);

export default router;
