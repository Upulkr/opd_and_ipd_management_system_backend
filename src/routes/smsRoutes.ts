// src/routes/smsRoutes.ts
import { Router } from "express";
import {
  cancelScheduledSMS,
  getScheduledSMS,
  scheduleSMS,
} from "../controllers/smsCOntroller";

const router = Router();

router.post("/schedule-sms", scheduleSMS);
router.delete("/schedule-sms/:jobId", cancelScheduledSMS);
router.get("/schedule-sms", getScheduledSMS);

export default router;
