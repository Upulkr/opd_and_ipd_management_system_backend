"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationController_1 = __importDefault(require("../controllers/authenticationController")); // Adjust the path as necessary
const router = (0, express_1.Router)();
router.post("/signup", authenticationController_1.default.signup);
router.get("/verify-email/:token", authenticationController_1.default.verifyEmail);
router.post("/resend-verification", authenticationController_1.default.resendVerificationEmail);
router.post("/login", authenticationController_1.default.login);
router.post("/logout", authenticationController_1.default.logout);
exports.default = router;
