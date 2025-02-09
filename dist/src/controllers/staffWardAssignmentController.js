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
exports.getAllStaffAssignments = exports.getStaffAssignmentsByRegisterId = exports.deleteStaffAssignment = exports.updateStaffAssignment = exports.createStaffAssignment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createStaffAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registrationId, nic, ward, role } = req.body.staff[0];
        console.log("registrationId", registrationId);
        const isRegistrationIdExists = yield prisma.wardAssignment.findFirst({
            where: {
                registrationId: Number(registrationId),
            },
        });
        if (isRegistrationIdExists) {
            return res.status(400).json({ error: " Already assigned." });
        }
        const newStaffAssignment = yield prisma.wardAssignment.create({
            data: {
                registrationId: Number(registrationId),
                nic,
                ward,
                role,
            },
        });
        res.status(200).json({
            message: "newStaffAssignment Created Successfully",
            newStaffAssignment,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createStaffAssignment = createStaffAssignment;
const updateStaffAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId: id } = req.params;
    if (!id)
        return res.status(400).json({ error: "Id is required." });
    const { ward } = req.body;
    try {
        const updatedStaffAssignment = yield prisma.wardAssignment.update({
            where: {
                id: Number(id),
            },
            data: { ward, id: Number(id) },
        });
        res.status(200).json(updatedStaffAssignment);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating StaffAssignment." });
    }
});
exports.updateStaffAssignment = updateStaffAssignment;
const deleteStaffAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId: id } = req.params;
    try {
        const deletedStaffAssignment = yield prisma.wardAssignment.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json(deletedStaffAssignment);
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting StaffAssignment." });
    }
});
exports.deleteStaffAssignment = deleteStaffAssignment;
const getStaffAssignmentsByRegisterId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationId } = req.params;
    try {
        const staffAssignments = yield prisma.wardAssignment.findMany({
            where: {
                registrationId: Number(registrationId),
            },
        });
        res.status(200).json(staffAssignments);
    }
    catch (error) {
        res.status(500).json({ error: "Error getting StaffAssignments." });
    }
});
exports.getStaffAssignmentsByRegisterId = getStaffAssignmentsByRegisterId;
const getAllStaffAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffAssignments = yield prisma.wardAssignment.findMany();
        res.status(200).json({ staffAssignments });
    }
    catch (error) {
        res.status(500).json({ error: "Error getting StaffAssignments." });
    }
});
exports.getAllStaffAssignments = getAllStaffAssignments;
