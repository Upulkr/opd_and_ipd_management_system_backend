"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const admissionController_1 = require("../controllers/admissionController");
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/generaldetails/:nic", verifyToken, hasPermission(["getadmiisionsGeneralDetails"]), admissionController_1.getadmiisionsGeneralDetails);
router.get("/generaladmisionsheet/:id", verifyToken, hasPermission(["admissionSheeetById"]), admissionController_1.admissionSheeetById);
router.get("/generaladmisionbook/:id", verifyToken, hasPermission(["admissionbookById"]), admissionController_1.admissionSheeetById);
exports.default = router;
