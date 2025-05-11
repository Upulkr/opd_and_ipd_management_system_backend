"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monthlyPatientVisitController_1 = require("../controllers/monthlyPatientVisitController");
const router = (0, express_1.Router)();
router.get("/", monthlyPatientVisitController_1.getMonthlyPatientVisit);
exports.default = router;
