import { Router } from "express";
import {
  createAdmissionSheet,
  deleteAdmissionSheet,
  getAdmissionSheets,
  getAllAdmissionSheetByNic,
  getrelatedAdmissionSheet,
  updateAdmissionSheet,
} from "../controllers/admissionSheetController";

const router = Router();
router.get("/", getAdmissionSheets);
router.post("/", createAdmissionSheet);
router.delete("/:nic/:bht", deleteAdmissionSheet);
router.get("/:nic", getAllAdmissionSheetByNic);
router.get("/:nic/:bht", getrelatedAdmissionSheet);
router.put("/:nic/:bht", updateAdmissionSheet);

export default router;
