import { Router } from "express";
import {
  createClininc,
  deleteClinic,
  getAllClinics,
  updateClinic,
} from "../controllers/clinicController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.get("/", verifyToken, hasPermission(["getAllClinics"]), getAllClinics);
router.post("/", verifyToken, hasPermission(["createClininc"]), createClininc);
router.put("/:id", verifyToken, hasPermission(["updateClinic"]), updateClinic);
router.delete(
  "/:id",
  verifyToken,
  hasPermission(["deleteClinic"]),
  deleteClinic
);

export default router;
