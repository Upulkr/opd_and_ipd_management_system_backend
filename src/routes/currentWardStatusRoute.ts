import { Router } from "express";
import { getCurrentWardStatus } from "../controllers/currentWardStatus";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();
router.get(
  "/",
  verifyToken,
  hasPermission(["getCurrentWardStatus"]),
  getCurrentWardStatus
);
export default router;
