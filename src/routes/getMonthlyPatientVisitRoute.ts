import { Router } from "express";
import { getMonthlyPatientVisit } from "../controllers/monthlyPatientVisitController";

const router = Router();
router.get("/", getMonthlyPatientVisit);

export default router;
