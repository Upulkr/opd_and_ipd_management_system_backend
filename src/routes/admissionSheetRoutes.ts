import { Router } from "express";
import {
  createAdmissionSheet,
  deleteAdmissionSheet,
  getAdmissionSheets,
  getAllAdmissionSheetByNic,
  getNumberOfAdmissionSheetsperDay,
  getNumberOfAdmissionSheetsperYear,
  getrelatedAdmissionSheetByBht,
  updateAdmissionSheet,
} from "../controllers/admissionSheetController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();
router.get(
  "/noOfAdmissionSheetsperyear",
  verifyToken,
  hasPermission(["getNumberOfAdmissionSheetsperYear"]),
  getNumberOfAdmissionSheetsperYear
);
router.get(
  "/noOfAdmissionSheetsperday",
  verifyToken,
  hasPermission(["getNumberOfAdmissionSheetsperDay"]),
  getNumberOfAdmissionSheetsperDay
);
router.get(
  "/bht",
  verifyToken,
  hasPermission(["getrelatedAdmissionSheetByBht"]),
  getrelatedAdmissionSheetByBht
);
router.post(
  "/",
  verifyToken,
  hasPermission(["createAdmissionSheet"]),
  createAdmissionSheet
);
router.delete(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["deleteAdmissionSheet"]),
  deleteAdmissionSheet
);
router.get("/:nic", getAllAdmissionSheetByNic);

router.put(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["updateAdmissionSheet"]),
  updateAdmissionSheet
);
router.get(
  "/",
  verifyToken,
  hasPermission(["getAdmissionSheets"]),
  getAdmissionSheets
);

export default router;
