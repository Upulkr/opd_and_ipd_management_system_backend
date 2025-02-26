"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffWardAssignmentController_1 = require("../controllers/staffWardAssignmentController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
router.post("/", staffWardAssignmentController_1.createStaffAssignment);
router.put("/:staffId", verifyToken, hasPermission(["updateStaffAssignment"]), staffWardAssignmentController_1.updateStaffAssignment);
router.delete("/:staffId", verifyToken, hasPermission(["deleteStaffAssignment"]), staffWardAssignmentController_1.deleteStaffAssignment);
router.get("/getstaffcount", verifyToken, hasPermission(["getStaffCountGroupByWard"]), staffWardAssignmentController_1.getStaffCountGroupByWard); // Specific first
router.get("/", verifyToken, hasPermission(["getAllStaffAssignments"]), staffWardAssignmentController_1.getAllStaffAssignments); // General second
router.get("/:registrationId", verifyToken, hasPermission(["getStaffAssignmentsByRegisterId"]), staffWardAssignmentController_1.getStaffAssignmentsByRegisterId); // Dynamic last
exports.default = router;
