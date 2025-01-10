"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OutPatientController_1 = require("../controllers/OutPatientController"); // Ensure the casing matches the actual file name
const router = (0, express_1.Router)();
router.post("/", OutPatientController_1.createOutPatient);
exports.default = router;
