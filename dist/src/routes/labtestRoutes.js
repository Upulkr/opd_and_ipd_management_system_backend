"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const labtestController_1 = require("../controllers/labtestController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.post("/", verifyToken, hasPermission(["createLabtest"]), labtestController_1.createLabtest);
router.get("/", verifyToken, hasPermission(["getAllLabtests"]), labtestController_1.getAllLabtests);
router.get("/:nic", verifyToken, hasPermission(["getAllLabtestByNic"]), labtestController_1.getAllLabtestByNic);
router.get("/:nic/:bht", verifyToken, hasPermission(["getrelatedLabtest"]), labtestController_1.getrelatedLabtest);
router.put("/:nic/:bht", verifyToken, hasPermission(["updateLabtest"]), labtestController_1.updateLabtest);
router.delete("/:nic/:bht", verifyToken, hasPermission(["deleteLabtest"]), labtestController_1.deleteLabtest);
exports.default = router;
