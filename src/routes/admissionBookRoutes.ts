import { Router } from "express";
import {
  createAdmissionBook,
  deleteAdmissionBook,
  getAdmissionBooks,
  getAllAdmissionBooksforNic,
  getrelatedAdmissionBookbyBHT,
  updateAdmissionBook,
} from "../controllers/admissionBookController";

const router = Router();
router.get("/bht", getrelatedAdmissionBookbyBHT);
router.get("/", getAdmissionBooks);
router.post("/", createAdmissionBook);
router.get("/:nic", getAllAdmissionBooksforNic);

router.put("/:nic/:bht", updateAdmissionBook);
router.delete("/:nic/:bht", deleteAdmissionBook);

export default router;
