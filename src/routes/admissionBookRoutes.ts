import { Router } from "express";
import {
  createAdmissionBook,
  deleteAdmissionBook,
  getAdmissionBooks,
  getAllAdmissionBooksforNic,
  getrelatedAdmissionBook,
  updateAdmissionBook,
} from "../controllers/admissionBookController";

const router = Router();

router.get("/", getAdmissionBooks);
router.post("/", createAdmissionBook);
router.get("/:nic", getAllAdmissionBooksforNic);
router.get("/:nic/:bht", getrelatedAdmissionBook);

router.put("/:nic/:bht", updateAdmissionBook);
router.delete("/:nic/:bht", deleteAdmissionBook);

export default router;
