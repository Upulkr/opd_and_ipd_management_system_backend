"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
const medicalReportController_1 = require("../controllers/medicalReportController");
router.post("/", verifyToken, hasPermission(["createMedicalReport"]), medicalReportController_1.createMedicalReport);
router.get("/", verifyToken, hasPermission(["getMedicalReports"]), medicalReportController_1.getMedicalReports);
router.get("/getallbynic/:nic", verifyToken, hasPermission(["getAllMedicalReportbyNic"]), medicalReportController_1.getAllMedicalReportbyNic);
router.get("/getrelated/:nic/:id", verifyToken, hasPermission(["getMEdicalRportbyNicandId"]), medicalReportController_1.getMEdicalRportbyNicandId);
router.get("/getbynicandtype/:nic/:doctype", verifyToken, hasPermission(["getMedicalReportByNicandType"]), medicalReportController_1.getMedicalReportByNicandType);
exports.default = router;
