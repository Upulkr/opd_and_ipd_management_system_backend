"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/smsRoutes.ts
const express_1 = require("express");
const smsCOntroller_1 = require("../controllers/smsCOntroller");
const router = (0, express_1.Router)();
router.post("/schedule-sms", smsCOntroller_1.scheduleSMS);
router.delete("/schedule-sms/:jobId", smsCOntroller_1.cancelScheduledSMS);
router.get("/schedule-sms", smsCOntroller_1.getScheduledSMS);
exports.default = router;
