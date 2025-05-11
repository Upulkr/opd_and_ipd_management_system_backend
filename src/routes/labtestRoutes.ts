import { Router } from "express";
import {
  createLabtest,
  deleteLabtest,
  getAllLabtestByNic,
  getAllLabtests,
  getrelatedLabtest,
  updateLabtest,
} from "../controllers/labtestController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.post("/", verifyToken, hasPermission(["createLabtest"]), createLabtest);
router.get("/", verifyToken, hasPermission(["getAllLabtests"]), getAllLabtests);
router.get(
  "/:nic",
  verifyToken,
  hasPermission(["getAllLabtestByNic"]),
  getAllLabtestByNic
);
router.get(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["getrelatedLabtest"]),
  getrelatedLabtest
);
router.put(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["updateLabtest"]),
  updateLabtest
);
router.delete(
  "/:nic/:bht",
  verifyToken,
  hasPermission(["deleteLabtest"]),
  deleteLabtest
);

export default router;
