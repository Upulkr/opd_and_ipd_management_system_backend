import { Router } from "express";
import {
  addNewDrug,
  deleteDrug,
  getAllDrugs,
  updateDrug,
} from "../controllers/drugController";

const router = Router();
router.put("/:drugId", updateDrug);
router.get("/", getAllDrugs);
router.post("/", addNewDrug);
router.delete("/:drugId", deleteDrug);

export default router;
