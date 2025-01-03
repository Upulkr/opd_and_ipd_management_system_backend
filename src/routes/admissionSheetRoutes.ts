import { Router } from "express";
import {
  createAdmissionSheet,
  deleteAdmissionSheet,
  getAdmissionSheets,
  getAllAdmissionSheetByNic,
  getrelatedAdmissionSheetByBht,
  updateAdmissionSheet,
} from "../controllers/admissionSheetController";

const router = Router();
router.get("/bht", getrelatedAdmissionSheetByBht);
router.post("/", createAdmissionSheet);
router.delete("/:nic/:bht", deleteAdmissionSheet);
router.get("/:nic", getAllAdmissionSheetByNic);

router.put("/:nic/:bht", updateAdmissionSheet);
router.get("/", getAdmissionSheets);
export default router;
