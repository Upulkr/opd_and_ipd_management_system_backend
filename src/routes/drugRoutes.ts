import { Router } from "express";
import {
  addNewDrug,
  createNewDrugAllocation,
  deleteDrug,
  getAllDrugs,
  getDrugAllocationbyWardName,
  updateDrug,
} from "../controllers/drugController";

const router = Router();
router.put("/:drugId", updateDrug);
router.get("/", getAllDrugs);
router.post("/", addNewDrug);
router.delete("/:drugId", deleteDrug);
router.get(
  "/getdrugallocationbywardname/:wardName",
  getDrugAllocationbyWardName
);
router.post("/createdrugallocation", createNewDrugAllocation);

export default router;
