"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffWardAssignmentController_1 = require("../controllers/staffWardAssignmentController");
const router = (0, express_1.Router)();
router.post("/", staffWardAssignmentController_1.createStaffAssignment);
router.put("/:staffId", staffWardAssignmentController_1.updateStaffAssignment);
router.delete("/:staffId", staffWardAssignmentController_1.deleteStaffAssignment);
router.get("/getstaffcount", staffWardAssignmentController_1.getStaffCountGroupByWard); // Specific first
router.get("/", staffWardAssignmentController_1.getAllStaffAssignments); // General second
router.get("/:registrationId", staffWardAssignmentController_1.getStaffAssignmentsByRegisterId); // Dynamic last
exports.default = router;
