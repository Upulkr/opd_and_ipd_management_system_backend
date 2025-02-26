import { Router } from "express";
import {
  createDisasePrediction,
  deleteDiseasePredictionByNic,
  getDiseasePredictionByNic,
  updateDiseasePredictionByNic,
} from "../controllers/diseasePredictionController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.post(
  "/",
  verifyToken,
  hasPermission(["createDisasePrediction"]),
  createDisasePrediction
);
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getDiseasePredictionByNic"]),
  getDiseasePredictionByNic
);
router.put(
  "/:nic",
  verifyToken,
  hasPermission(["updateDiseasePredictionByNic"]),
  updateDiseasePredictionByNic
);
router.delete(
  "/:nic",
  verifyToken,
  hasPermission(["deleteDiseasePredictionByNic"]),
  deleteDiseasePredictionByNic
);

export default router;
