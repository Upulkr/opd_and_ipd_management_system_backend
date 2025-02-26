"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drugChartController_1 = require("../controllers/drugChartController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.get("/", verifyToken, hasPermission(["getDrugCharts"]), drugChartController_1.getDrugCharts);
router.get("/:nic", verifyToken, hasPermission(["getAllDrugChartByNic"]), drugChartController_1.getAllDrugChartByNic);
router.get("/:nic/:bht", verifyToken, hasPermission(["getrelatedDrugChart"]), drugChartController_1.getrelatedDrugChart);
router.post("/", verifyToken, hasPermission(["createDrugChart"]), drugChartController_1.createDrugChart);
router.delete("/:nic", verifyToken, hasPermission(["deleteDrugChart"]), drugChartController_1.deleteDrugChart);
router.put("/:nic", verifyToken, hasPermission(["updateDrugChart"]), drugChartController_1.updateDrugChart);
exports.default = router;
