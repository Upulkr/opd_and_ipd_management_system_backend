"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wardBedsController_1 = require("../controllers/wardBedsController");
const router = (0, express_1.Router)();
router.put("/:wardNo", wardBedsController_1.changeBedStatusForInpatientTable);
exports.default = router;
