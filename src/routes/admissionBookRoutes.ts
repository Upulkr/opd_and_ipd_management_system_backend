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

/**
 * @route GET /noofadmissionbookstoday
 * @description Get the number of admission books created today
 * @access Public
 */
router.get("/noofadmissionbookstoday", getNumberOfAdmissionBooksToday);

/**
 * @route GET /getdischargecounts
 * @description Get discharge counts
 * @access Public
 */
router.get("/getdischargecounts", getDischargeCounts);

/**
 * @route GET /bht
 * @description Get related Admission Book by BHT
 * @access Protected
 * @permission getrelatedAdmissionBookbyBHT
 */
router.get(
  "/bht",
  verifyToken,
  hasPermission(["getrelatedAdmissionBookbyBHT"]),
  getrelatedAdmissionBookbyBHT,
);

/**
 * @route GET /
 * @description Get all admission books
 * @access Protected
 * @permission getAdmissionBooks
 */
router.get(
  "/",
  verifyToken,
  hasPermission(["getAdmissionBooks"]),
  getAdmissionBooks,
);

/**
 * @route POST /
 * @description Create a new admission book entry
 * @access Protected
 * @permission createAdmissionBook
 */
router.post(
  "/",
  verifyToken,
  hasPermission(["createAdmissionBook"]),
  createAdmissionBook,
);

/**
 * @route GET /:nic
 * @description Get all admission books for a specific NIC
 * @access Protected
 * @permission getAllAdmissionBooksforNic
 */
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getAllAdmissionBooksforNic"]),
  getAllAdmissionBooksforNic,
);

/**
 * @route PUT /:nic/:bht
 * @description Update an admission book entry
 * @access Protected
 * @permission updateAdmissionBook
 */
router.put(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["updateAdmissionBook"]),
  updateAdmissionBook,
);

/**
 * @route DELETE /:nic/:bht
 * @description Delete an admission book entry
 * @access Protected
 * @permission deleteAdmissionBook
 */
router.delete(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["deleteAdmissionBook"]),
  deleteAdmissionBook,
);

export default router;
