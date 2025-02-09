import { Router } from "express";
import {
  createStaffAssignment,
  deleteStaffAssignment,
  getAllStaffAssignments,
  getStaffAssignmentsByRegisterId,
  updateStaffAssignment,
} from "../controllers/staffWardAssignmentController";

const router = Router();

router.post("/", createStaffAssignment);
router.get("/:registrationId", getStaffAssignmentsByRegisterId);
router.put("/:staffId", updateStaffAssignment);
router.delete("/:staffId", deleteStaffAssignment);
router.get("/", getAllStaffAssignments);

export default router;
