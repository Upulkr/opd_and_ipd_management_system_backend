"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const diseasePredictionController_1 = require("../controllers/diseasePredictionController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.post("/", verifyToken, hasPermission(["createDisasePrediction"]), diseasePredictionController_1.createDisasePrediction);
router.get("/:nic", verifyToken, hasPermission(["getDiseasePredictionByNic"]), diseasePredictionController_1.getDiseasePredictionByNic);
router.put("/:nic", verifyToken, hasPermission(["updateDiseasePredictionByNic"]), diseasePredictionController_1.updateDiseasePredictionByNic);
router.delete("/:nic", verifyToken, hasPermission(["deleteDiseasePredictionByNic"]), diseasePredictionController_1.deleteDiseasePredictionByNic);
exports.default = router;
