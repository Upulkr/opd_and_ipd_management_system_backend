"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wardBedsController_1 = require("../controllers/wardBedsController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", wardBedsController_1.getAllWardBedsCount);
exports.default = router;
