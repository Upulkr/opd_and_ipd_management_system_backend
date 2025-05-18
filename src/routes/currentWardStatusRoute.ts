import { Router } from "express";
import {
  getCurrentWardStatus,
  getWardNames,
} from "../controllers/currentWardStatus";
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
router.get("/wardnames", getWardNames);
export default router;
