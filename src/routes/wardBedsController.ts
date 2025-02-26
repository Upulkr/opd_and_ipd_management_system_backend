import { Router } from "express";
import { changeBedStatusForInpatientTable } from "../controllers/wardBedsController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.put(
  "/:wardNo",
  verifyToken,
  hasPermission(["changeBedStatusForInpatientTable"]),
  changeBedStatusForInpatientTable
);

export default router;
