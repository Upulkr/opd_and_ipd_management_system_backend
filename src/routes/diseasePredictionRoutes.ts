import { Router } from "express";
import {
  createDisasePrediction,
  deleteDiseasePredictionByNic,
  getDiseasePredictionByNic,
  updateDiseasePredictionByNic,
} from "../controllers/diseasePredictionController";
const router = Router();

router.post("/", createDisasePrediction);
router.get("/:nic", getDiseasePredictionByNic);
router.put("/:nic", updateDiseasePredictionByNic);
router.delete("/:nic", deleteDiseasePredictionByNic);

export default router;
