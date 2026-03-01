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

/**
 * @route GET /
 * @description Get current ward status
 * @access Protected
 * @permission getCurrentWardStatus
 */
router.get(
  "/",
  verifyToken,
  hasPermission(["getCurrentWardStatus"]),
  getCurrentWardStatus,
);

/**
 * @route GET /wardnames
 * @description Get all ward names
 * @access Public
 */
router.get("/wardnames", getWardNames);

export default router;
