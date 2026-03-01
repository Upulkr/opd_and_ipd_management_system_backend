import e, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
import {
  admissionSheeetById,
  getadmiisionsGeneralDetails,
  admissionBookById,
} from "../controllers/admissionController";

// Destructure middleware functions for ease of use
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;

// Initialize the Express router
const router = Router();

/**
 * Route to get general admission details by NIC (National Identity Card).
 * Protected by:
 * - verifyToken: Ensures the user is authenticated.
 * - hasPermission: Ensures the user has the 'getadmiisionsGeneralDetails' permission.
 */
router.get(
  "/generaldetails/:nic",
  verifyToken,
  hasPermission(["getadmiisionsGeneralDetails"]),
  getadmiisionsGeneralDetails,
);

/**
 * Route to get a specific admission sheet by its ID.
 * Protected by:
 * - verifyToken: Ensures the user is authenticated.
 * - hasPermission: Ensures the user has the 'admissionSheeetById' permission.
 */
router.get(
  "/generaladmisionsheet/:id",
  verifyToken,
  hasPermission(["admissionSheeetById"]),
  admissionSheeetById,
);

/**
 * Route to get an admission book entry by its ID.
 * Note: It currently reuses the 'admissionSheeetById' controller.
 * Protected by:
 * - verifyToken: Ensures the user is authenticated.
 * - hasPermission: Ensures the user has the 'admissionbookById' permission.
 */
router.get(
  "/generaladmisionbook/:id",
  verifyToken,
  hasPermission(["admissionbookById"]),
  admissionBookById,
);

export default router;
