"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLabTechnicians = exports.getAllNurses = exports.getAllDoctors = exports.getAllPatients = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserByNic = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving users: ${error.message}` });
    }
});
exports.getAllUsers = getAllUsers;
const getUserByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the NIC from the request query or parameters
        const { nic } = req.params;
        // Validate input
        if (!nic) {
            res.status(400).json({ error: "NIC is required." });
            return;
        }
        // Fetch the user from the database
        const user = yield prisma.user.findUnique({
            where: { nic },
        });
        // Check if user exists
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        // Return the user data
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            error: "An error occurred while fetching the user.",
            details: error.message,
        });
    }
});
exports.getUserByNic = getUserByNic;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract user data from the request body
        const { nic, name, email, password, role } = req.body;
        // Validate input
        if (!nic || !name || !email || !password || !role) {
            res.status(400).json({
                error: "All fields (nic, name, email, password, role) are required.",
            });
            return;
        }
        // Check if the role is valid
        const validRoles = ["DOCTOR", "NURSE", "PATIENT", "LABTECHNICIAN"];
        if (!validRoles.includes(role)) {
            res
                .status(400)
                .json({ error: `Role must be one of: ${validRoles.join(", ")}.` });
            return;
        }
        // Create the user in the database
        const user = yield prisma.user.create({
            data: {
                nic,
                name,
                email,
                password, // Ideally, hash the password before saving
                role,
            },
        });
        // Return the created user
        res.status(201).json(user);
    }
    catch (error) {
        console.error("Error creating user:", error);
        // Handle unique constraint errors
        if (error.code === "P2002") {
            res.status(409).json({ error: "NIC or email already exists." });
            return;
        }
        // Handle other errors
        res.status(500).json({
            error: "An error occurred while creating the user.",
            details: error.message,
        });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract user data from the request body
        const { nic, name, email, password, role } = req.body;
        // Validate input
        if (!nic || !name || !email || !password || !role) {
            res.status(400).json({
                error: "All fields (nic, name, email, password, role) are required.",
            });
            return;
        }
        // Check if the role is valid
        const validRoles = ["DOCTOR", "NURSE", "PATIENT", "LABTECHNICIAN"];
        if (!validRoles.includes(role)) {
            res
                .status(400)
                .json({ error: `Role must be one of: ${validRoles.join(", ")}.` });
            return;
        }
        // Update the user in the database
        const user = yield prisma.user.update({
            where: { nic },
            data: {
                name,
                email,
                password, // Ideally, hash the password before saving
                role,
            },
        });
        // Return the updated user
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error updating user:", error);
        // Handle unique constraint errors
        if (error.code === "P2002") {
            res.status(409).json({ error: "NIC or email already exists." });
            return;
        }
        // Handle other errors
        res.status(500).json({
            error: "An error occurred while updating the user.",
            details: error.message,
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        if (!nic) {
            res.status(400).json({ error: "NIC is required." });
            return;
        }
        yield prisma.user.delete({
            where: { nic },
        });
        res.status(200).json({ message: "User deleted successfully." });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting user: ${error.message}` });
    }
});
exports.deleteUser = deleteUser;
const getAllPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield prisma.user.findMany({
            where: {
                role: "PATIENT",
            },
        });
        res.json(patients);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving patients: ${error.message}` });
    }
});
exports.getAllPatients = getAllPatients;
const getAllDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield prisma.user.findMany({
            where: {
                role: "DOCTOR",
            },
        });
        res.json(doctors);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving doctors: ${error.message}` });
    }
});
exports.getAllDoctors = getAllDoctors;
const getAllNurses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurses = yield prisma.user.findMany({
            where: {
                role: "NURSE",
            },
        });
        res.status(200).json(nurses);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving nurses: ${error.message}` });
    }
});
exports.getAllNurses = getAllNurses;
const getAllLabTechnicians = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labTechnicians = yield prisma.user.findMany({
            where: { role: "LABTECHNICIAN" },
        });
        res.status(200).json(labTechnicians);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving lab technicians: ${error.message}` });
    }
});
exports.getAllLabTechnicians = getAllLabTechnicians;
