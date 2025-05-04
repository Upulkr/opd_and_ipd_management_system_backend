"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const permissionMiddleware_1 = __importDefault(require("../middleware/permissionMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
// import {
//   createUser,
//   deleteUser,
//   getAllDoctors,
//   getAllLabTechnicians,
//   getAllNurses,
//   getAllPatients,
//   getAllUsers,
//   getUserByNic,
//   updateUser,
// } from "../controllers/userController";
const { hasPermission, canAccessPatient } = permissionMiddleware_1.default;
const { verifyToken } = authMiddleware_1.default;
const router = (0, express_1.Router)();
// router.get("/", getAllUsers);
// router.post("/", getUserByNic);
// router.post("/", createUser);
// router.get("/:nic", updateUser);
// router.put("/:nic", updateUser);
// router.delete("/:nic", deleteUser);
// router.get("/", getAllLabTechnicians);
// router.get("/", getAllNurses);
router.get("/getalldoctors", verifyToken, hasPermission(["getAllDoctors"]), userController_1.getAllDoctors);
// router.get("/", getAllPatients);
exports.default = router;
