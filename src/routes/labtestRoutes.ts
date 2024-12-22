import { Router } from "express";
import {
  createLabtest,
  deleteLabtest,
  getAllLabtestByNic,
  getAllLabtests,
  getrelatedLabtest,
  updateLabtest,
} from "../controllers/labtestController";

const router = Router();

router.post("/", createLabtest);
router.get("/", getAllLabtests);
router.get("/:nic", getAllLabtestByNic);
router.get("/:nic/:bht", getrelatedLabtest);
router.put("/:nic/:bht", updateLabtest);
router.delete("/:nic/:bht", deleteLabtest);

export default router;
