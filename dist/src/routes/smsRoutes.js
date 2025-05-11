"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/smsRoutes.ts
const express_1 = require("express");
const smsCOntroller_1 = require("../controllers/smsCOntroller");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.post("/schedule-sms", verifyToken, hasPermission(["scheduleSMS"]), smsCOntroller_1.scheduleSMS);
router.delete("/schedule-sms/:jobId", verifyToken, hasPermission(["cancelScheduledSMS"]), smsCOntroller_1.cancelScheduledSMS);
router.get("/schedule-sms", verifyToken, hasPermission(["getScheduledSMS"]), smsCOntroller_1.getScheduledSMS);
exports.default = router;
