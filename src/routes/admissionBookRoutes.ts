import { Router } from "express";
import {
  createAdmissionBook,
  deleteAdmissionBook,
  getAdmissionBooks,
  getAllAdmissionBooksforNic,
  getDischargeCounts,
  getNumberOfAdmissionBooksToday,
  getrelatedAdmissionBookbyBHT,
  updateAdmissionBook,
} from "../controllers/admissionBookController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();
router.get(
  "/noofadmissionbookstoday",

  getNumberOfAdmissionBooksToday
);
router.get("/getdischargecounts", getDischargeCounts);
router.get(
  "/bht",
  verifyToken,
  hasPermission(["getrelatedAdmissionBookbyBHT"]),
  getrelatedAdmissionBookbyBHT
);
router.get(
  "/",
  verifyToken,
  hasPermission(["getAdmissionBooks"]),
  getAdmissionBooks
);
router.post(
  "/",
  verifyToken,
  hasPermission(["createAdmissionBook"]),
  createAdmissionBook
);
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getAllAdmissionBooksforNic"]),
  getAllAdmissionBooksforNic
);

router.put(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["updateAdmissionBook"]),
  updateAdmissionBook
);
router.delete(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["deleteAdmissionBook"]),
  deleteAdmissionBook
);

export default router;
