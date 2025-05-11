import e, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
import {
  admissionSheeetById,
  getadmiisionsGeneralDetails,
} from "../controllers/admissionController";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.get(
  "/generaldetails/:nic",
  verifyToken,
  hasPermission(["getadmiisionsGeneralDetails"]),
  getadmiisionsGeneralDetails
);
router.get(
  "/generaladmisionsheet/:id",
  verifyToken,
  hasPermission(["admissionSheeetById"]),
  admissionSheeetById
);
router.get(
  "/generaladmisionbook/:id",
  verifyToken,
  hasPermission(["admissionbookById"]),
  admissionSheeetById
);
export default router;
