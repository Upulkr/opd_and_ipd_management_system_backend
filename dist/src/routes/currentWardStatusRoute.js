"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const currentWardStatus_1 = require("../controllers/currentWardStatus");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/", verifyToken, hasPermission(["getCurrentWardStatus"]), currentWardStatus_1.getCurrentWardStatus);
router.get("/wardnames", currentWardStatus_1.getWardNames);
exports.default = router;
