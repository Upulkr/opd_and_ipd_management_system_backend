import { Router } from "express";
import {
  addNewDrug,
  createNewDrugAllocation,
  deleteDrug,
  getAllDrugs,
  getDrugAllocationbyWardName,
  getDrugById,
  updateDrug,
} from "../controllers/drugController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.put("/:drugId", verifyToken, hasPermission(["updateDrug"]), updateDrug);
router.get("/", verifyToken, hasPermission(["getAllDrugs"]), getAllDrugs);
router.post("/", verifyToken, hasPermission(["addNewDrug"]), addNewDrug);
router.delete(
  "/:drugId",
  verifyToken,
  hasPermission(["deleteDrug"]),
  deleteDrug
);
router.get(
  "/getdrugbyid/:drugId",
  verifyToken,
  hasPermission(["getDrugById"]),
  getDrugById
);
router.get(
  "/getdrugallocationbywardname/:wardName",
  verifyToken,
  hasPermission(["getDrugAllocationbyWardName"]),
  getDrugAllocationbyWardName
);
router.post(
  "/createdrugallocation",
  verifyToken,
  hasPermission(["createNewDrugAllocation"]),
  createNewDrugAllocation
);

export default router;
