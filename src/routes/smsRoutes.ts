// src/routes/smsRoutes.ts
import { Router } from "express";
import {
  cancelScheduledSMS,
  getScheduledSMS,
  scheduleSMS,
} from "../controllers/smsCOntroller";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.post(
  "/schedule-sms",
  verifyToken,
  hasPermission(["scheduleSMS"]),
  scheduleSMS
);
router.delete(
  "/schedule-sms/:jobId",
  verifyToken,
  hasPermission(["cancelScheduledSMS"]),
  cancelScheduledSMS
);
router.get(
  "/schedule-sms",
  verifyToken,
  hasPermission(["getScheduledSMS"]),
  getScheduledSMS
);

export default router;
