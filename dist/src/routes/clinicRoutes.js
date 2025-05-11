"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clinicController_1 = require("../controllers/clinicController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/", verifyToken, hasPermission(["getAllClinics"]), clinicController_1.getAllClinics);
router.post("/", verifyToken, hasPermission(["createClininc"]), clinicController_1.createClininc);
router.put("/:id", verifyToken, hasPermission(["updateClinic"]), clinicController_1.updateClinic);
router.delete("/:id", verifyToken, hasPermission(["deleteClinic"]), clinicController_1.deleteClinic);
exports.default = router;
