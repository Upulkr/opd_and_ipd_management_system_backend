"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OutPatientController_1 = require("../controllers/OutPatientController"); // Ensure the casing matches the actual file name
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/getstaff", verifyToken, hasPermission(["getStaffMemebers"]), OutPatientController_1.getStaffMemebers);
router.post("/", verifyToken, hasPermission(["createOutPatient"]), OutPatientController_1.createOutPatient);
router.get("/", verifyToken, hasPermission(["getAllOutPatientsToday"]), OutPatientController_1.getAllOutPatientsToday);
router.get("/outpatientscount", OutPatientController_1.getNumberOfOutPatientsToday);
router.get("/:nic", verifyToken, hasPermission(["getOutPatientByNic"]), OutPatientController_1.getOutPatientByNic);
exports.default = router;
