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

const router = Router();
router.get("/noOfAdmissionSheetsperyear", getNumberOfAdmissionSheetsperYear);
router.get("/noOfAdmissionSheetsperday", getNumberOfAdmissionSheetsperDay);
router.get("/bht", getrelatedAdmissionSheetByBht);
router.post("/", createAdmissionSheet);
router.delete("/:nic/:bht", deleteAdmissionSheet);
router.get("/:nic", getAllAdmissionSheetByNic);

router.put("/:nic/:bht", updateAdmissionSheet);
router.get("/", getAdmissionSheets);

export default router;
