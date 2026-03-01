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

// Destructure middleware functions for cleaner usage
// hasPermission: Checks if the user has the required specific permission
// verifyToken: Ensures the request has a valid authentication token
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;

/**
 * Route: GET /
 * Description: Retrieve a list of all patients.
 * Protection: Requires valid token and 'getAllPatients' permission.
 */
router.get("/", verifyToken, hasPermission(["getAllPatients"]), getAllPatients);

/**
 * Route: GET /:nic
 * Description: Retrieve a specific patient's details using their NIC.
 * Protection: Requires valid token and 'getPatientByNic' permission.
 */
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getPatientByNic"]),
  getPatientByNic,
);

/**
 * Route: POST /
 * Description: Create a new patient record.
 * Protection: Requires valid token and 'createPatient' permission.
 */
router.post("/", verifyToken, hasPermission(["createPatient"]), createPatient);

/**
 * Route: DELETE /:nic
 * Description: Delete a patient record by NIC.
 * Protection: Requires valid token and 'deletePatient' permission.
 */
router.delete(
  "/:nic",
  verifyToken,
  hasPermission(["deletePatient"]),
  deletePatient,
);

/**
 * Route: PUT /:nic
 * Description: Update an existing patient's details by NIC.
 * Protection: Requires valid token and 'updatePatient' permission.
 */
router.put(
  "/:nic",
  verifyToken,
  hasPermission(["updatePatient"]),
  updatePatient,
);

/**
 * Route: GET /isPatientexist/:nic
 * Description: Check if a patient exists in the database by NIC.
 * Protection: Requires valid token and 'isPatientExist' permission.
 */
router.get(
  "/isPatientexist/:nic",
  verifyToken,
  hasPermission(["isPatientExist"]),
  isPatientExist,
);

export default router;
