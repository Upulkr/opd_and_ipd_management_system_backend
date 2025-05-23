"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mobileClinicController_1 = require("../controllers/mobileClinicController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/", verifyToken, hasPermission(["getAllMobileClinics"]), mobileClinicController_1.getAllMobileClinics);
router.post("/", verifyToken, hasPermission(["createMObileClinic"]), mobileClinicController_1.createMObileClinic);
router.delete("/", verifyToken, hasPermission(["deleteMobileClinicAssigment"]), mobileClinicController_1.deleteMobileClinicAssigment);
router.put("/id", verifyToken, hasPermission(["updateMobileClinicAssigment"]), mobileClinicController_1.updateMobileClinicAssigment);
router.get("/sheduled", verifyToken, hasPermission(["getAllMobileClinicAssigmentsForTable"]), mobileClinicController_1.getAllMobileClinicAssigmentsForTable);
router.put("/markascompleted", verifyToken, hasPermission(["updateMobileClinincCompletedStatus"]), mobileClinicController_1.updateMobileClinincCompletedStatus);
router.get("/getcountofcompletedmobileclinincs", verifyToken, hasPermission(["getCountOfCompletedMobileClinicsFor30days"]), mobileClinicController_1.getCountOfCompletedMobileClinicsFor30days);
router.get("/monthlyhomevisits", verifyToken, hasPermission(["getMothlyMobileClinicCount"]), mobileClinicController_1.getMothlyMobileClinicCount);
router.get(`/getpatientsbyage`, verifyToken, hasPermission(["getPatientsByage"]), mobileClinicController_1.getPatientsByage);
exports.default = router;
