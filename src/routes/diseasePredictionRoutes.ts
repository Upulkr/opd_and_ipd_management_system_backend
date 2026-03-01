import { Router } from "express";
import {
  createDisasePrediction,
  deleteDiseasePredictionByNic,
  getDiseasePredictionByNic,
  updateDiseasePredictionByNic,
} from "../controllers/diseasePredictionController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// Destructure middleware for cleaner usage
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;

/**
 * Route: POST /
 * Description: Create a new disease prediction.
 * Protection: Requires valid token and 'createDisasePrediction' permission.
 */
router.post(
  "/",
  verifyToken,
  hasPermission(["createDisasePrediction"]),
  createDisasePrediction,
);

/**
 * Route: GET /:nic
 * Description: Get disease predictions by NIC.
 * Protection: Requires valid token and 'getDiseasePredictionByNic' permission.
 */
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getDiseasePredictionByNic"]),
  getDiseasePredictionByNic,
);

/**
 * Route: PUT /:nic
 * Description: Update a disease prediction by NIC.
 * Protection: Requires valid token and 'updateDiseasePredictionByNic' permission.
 */
router.put(
  "/:nic",
  verifyToken,
  hasPermission(["updateDiseasePredictionByNic"]),
  updateDiseasePredictionByNic,
);

/**
 * Route: DELETE /:nic
 * Description: Delete a disease prediction by NIC.
 * Protection: Requires valid token and 'deleteDiseasePredictionByNic' permission.
 */
router.delete(
  "/:nic",
  verifyToken,
  hasPermission(["deleteDiseasePredictionByNic"]),
  deleteDiseasePredictionByNic,
);

export default router;
