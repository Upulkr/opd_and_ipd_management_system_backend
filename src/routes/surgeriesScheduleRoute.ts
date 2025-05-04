import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
import {
  createSurgerySchedule,
  deleteSurgerySchedule,
  getAllSurgerySchedules,
  getSurgeryScheduleById,
  updateSurgerySchedule,
} from "../controllers/surgeryScheduleController";

const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();

router.get(
  "/getallsurgeryschedule",
  verifyToken,
  hasPermission(["getSurgeriesSchedule"]),
  getAllSurgerySchedules
);
router.post(
  "/createsurgeryschedule",
  verifyToken,
  hasPermission(["createSurgeriesSchedule"]),
  createSurgerySchedule
);
router.put(
  "/updatesurgeryschedule/:id",
  verifyToken,
  hasPermission(["updateSurgeriesSchedule"]),
  updateSurgerySchedule
);
router.get(
  "/getsurgerybyid/:id",
  verifyToken,
  hasPermission(["getSurgeryScheduleById"]),
  getSurgeryScheduleById
);

router.delete(
  "/deletesurgeryschedule/:id",
  verifyToken,
  hasPermission(["deleteSurgeriesSchedule"]),
  deleteSurgerySchedule
);
export default router;
