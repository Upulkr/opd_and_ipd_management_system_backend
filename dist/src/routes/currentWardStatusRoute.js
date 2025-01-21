"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const currentWardStatus_1 = require("../controllers/currentWardStatus");
const router = (0, express_1.Router)();
router.get("/", currentWardStatus_1.getCurrentWardStatus);
exports.default = router;
