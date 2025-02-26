"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drugController_1 = require("../controllers/drugController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.put("/:drugId", verifyToken, hasPermission(["updateDrug"]), drugController_1.updateDrug);
router.get("/", verifyToken, hasPermission(["getAllDrugs"]), drugController_1.getAllDrugs);
router.post("/", verifyToken, hasPermission(["addNewDrug"]), drugController_1.addNewDrug);
router.delete("/:drugId", verifyToken, hasPermission(["deleteDrug"]), drugController_1.deleteDrug);
router.get("/getdrugallocationbywardname/:wardName", verifyToken, hasPermission(["getDrugAllocationbyWardName"]), drugController_1.getDrugAllocationbyWardName);
router.post("/createdrugallocation", verifyToken, hasPermission(["createNewDrugAllocation"]), drugController_1.createNewDrugAllocation);
exports.default = router;
