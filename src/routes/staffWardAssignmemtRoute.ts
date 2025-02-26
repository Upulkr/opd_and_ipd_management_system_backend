import { Router } from "express";
import {
  createStaffAssignment,
  deleteStaffAssignment,
  getAllStaffAssignments,
  getStaffAssignmentsByRegisterId,
  getStaffCountGroupByWard,
  updateStaffAssignment,
} from "../controllers/staffWardAssignmentController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.post("/", createStaffAssignment);

router.put(
  "/:staffId",
  verifyToken,
  hasPermission(["updateStaffAssignment"]),
  updateStaffAssignment
);
router.delete(
  "/:staffId",
  verifyToken,
  hasPermission(["deleteStaffAssignment"]),
  deleteStaffAssignment
);
router.get(
  "/getstaffcount",
  verifyToken,
  hasPermission(["getStaffCountGroupByWard"]),
  getStaffCountGroupByWard
); // Specific first
router.get(
  "/",
  verifyToken,
  hasPermission(["getAllStaffAssignments"]),
  getAllStaffAssignments
); // General second
router.get(
  "/:registrationId",
  verifyToken,
  hasPermission(["getStaffAssignmentsByRegisterId"]),
  getStaffAssignmentsByRegisterId
); // Dynamic last

export default router;
