"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admissionBookController_1 = require("../controllers/admissionBookController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/bht", verifyToken, hasPermission(["getrelatedAdmissionBookbyBHT"]), admissionBookController_1.getrelatedAdmissionBookbyBHT);
router.get("/", verifyToken, hasPermission(["getAdmissionBooks"]), admissionBookController_1.getAdmissionBooks);
router.post("/", verifyToken, hasPermission(["createAdmissionBook"]), admissionBookController_1.createAdmissionBook);
router.get("/:nic", verifyToken, hasPermission(["getAllAdmissionBooksforNic"]), admissionBookController_1.getAllAdmissionBooksforNic);
router.put("/:nic/:bht", verifyToken, hasPermission(["updateAdmissionBook"]), admissionBookController_1.updateAdmissionBook);
router.delete("/:nic/:bht", verifyToken, hasPermission(["deleteAdmissionBook"]), admissionBookController_1.deleteAdmissionBook);
exports.default = router;
