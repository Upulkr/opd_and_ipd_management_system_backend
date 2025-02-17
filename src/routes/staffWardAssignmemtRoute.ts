import { Router } from "express";
import {
  createStaffAssignment,
  deleteStaffAssignment,
  getAllStaffAssignments,
  getStaffAssignmentsByRegisterId,
  getStaffCountGroupByWard,
  updateStaffAssignment,
} from "../controllers/staffWardAssignmentController";

const router = Router();

router.post("/", createStaffAssignment);

router.put("/:staffId", updateStaffAssignment);
router.delete("/:staffId", deleteStaffAssignment);
router.get("/getstaffcount", getStaffCountGroupByWard); // Specific first
router.get("/", getAllStaffAssignments); // General second
router.get("/:registrationId", getStaffAssignmentsByRegisterId); // Dynamic last

export default router;
