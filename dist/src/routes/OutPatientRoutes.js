"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OutpatientController_1 = require("../controllers/OutpatientController"); // Ensure the casing matches the actual file name
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/getstaff", verifyToken, hasPermission(["getStaffMemebers"]), OutpatientController_1.getStaffMemebers);
router.post("/", verifyToken, hasPermission(["createOutPatient"]), OutpatientController_1.createOutPatient);
router.get("/", verifyToken, hasPermission(["getAllOutPatientsToday"]), OutpatientController_1.getAllOutPatientsToday);
router.get("/outpatientscount", OutpatientController_1.getNumberOfOutPatientsToday);
router.get("/:nic", verifyToken, hasPermission(["getOutPatientByNic"]), OutpatientController_1.getOutPatientByNic);
exports.default = router;
