import { Router } from "express";
import {
  createClininc,
  deleteClinic,
  getAllClinics,
  updateClinic,
} from "../controllers/clinicController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

/**
 * @route GET /
 * @description Get all clinics
 * @access Protected
 * @permission getAllClinics
 */
router.get("/", verifyToken, hasPermission(["getAllClinics"]), getAllClinics);

/**
 * @route POST /
 * @description Create a new clinic
 * @access Protected
 * @permission createClininc
 */
router.post("/", verifyToken, hasPermission(["createClininc"]), createClininc);

/**
 * @route PUT /:id
 * @description Update a clinic
 * @access Protected
 * @permission updateClinic
 */
router.put("/:id", verifyToken, hasPermission(["updateClinic"]), updateClinic);

/**
 * @route DELETE /:id
 * @description Delete a clinic
 * @access Protected
 * @permission deleteClinic
 */
router.delete(
  "/:id",
  verifyToken,
  hasPermission(["deleteClinic"]),
  deleteClinic,
);

export default router;
