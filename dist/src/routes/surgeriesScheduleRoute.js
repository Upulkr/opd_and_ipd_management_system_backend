"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const surgeryScheduleController_1 = require("../controllers/surgeryScheduleController");
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/getallsurgeryschedule", verifyToken, hasPermission(["getSurgeriesSchedule"]), surgeryScheduleController_1.getAllSurgerySchedules);
router.post("/createsurgeryschedule", verifyToken, hasPermission(["createSurgeriesSchedule"]), surgeryScheduleController_1.createSurgerySchedule);
router.put("/updatesurgeryschedule/:id", verifyToken, hasPermission(["updateSurgeriesSchedule"]), surgeryScheduleController_1.updateSurgerySchedule);
router.get("/getsurgerybyid/:id", verifyToken, hasPermission(["getSurgeryScheduleById"]), surgeryScheduleController_1.getSurgeryScheduleById);
router.delete("/deletesurgeryschedule/:id", verifyToken, hasPermission(["deleteSurgeriesSchedule"]), surgeryScheduleController_1.deleteSurgerySchedule);
exports.default = router;
