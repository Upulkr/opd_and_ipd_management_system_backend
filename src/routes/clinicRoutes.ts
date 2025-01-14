import { Router } from "express";
import {
  createClininc,
  deleteClinic,
  getAllClinics,
  updateClinic,
} from "../controllers/clinicController";

const router = Router();

router.get("/", getAllClinics);
router.post("/", createClininc);
router.put("/:id", updateClinic);
router.delete("/:id", deleteClinic);

export default router;
