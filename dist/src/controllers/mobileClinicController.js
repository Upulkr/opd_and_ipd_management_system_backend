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
exports.getAllMobileClinicAssigmentsForTable = exports.updateMobileClinicAssigment = exports.deleteMobileClinicAssigment = exports.getAllMobileClinics = exports.createMObileClinic = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMObileClinic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clinicId, nic, location, clinicName, sheduledAt } = req.body;
    try {
        const newMobileClinincAssignmnet = yield prisma.mobileclinicAssignment.create({
            data: { clinicId, nic, location, clinicName, sheduledAt },
        });
        res.status(200).json({
            newMobileClinincAssignmnet,
            message: "MobileClininc created successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error creating mobile clinic:${error}` });
    }
});
exports.createMObileClinic = createMObileClinic;
const getAllMobileClinics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mobileClinics = yield prisma.mobileclinicAssignment.findMany();
        res.status(200).json(mobileClinics);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllMobileClinics = getAllMobileClinics;
const deleteMobileClinicAssigment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedClinicAssigment = yield prisma.mobileclinicAssignment.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json({
            deletedClinicAssigment,
            message: "Clinic Assigment deleted successfully!",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting clinics:${error.message}` });
    }
});
exports.deleteMobileClinicAssigment = deleteMobileClinicAssigment;
const updateMobileClinicAssigment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedClinicAssigment = yield prisma.mobileclinicAssignment.update({
            where: {
                id: Number(id),
            },
            data: req.body,
        });
        res.status(200).json({
            updatedClinicAssigment,
            message: "MobileClinic Assigment updated successfully!",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating clinics:${error.message}` });
    }
});
exports.updateMobileClinicAssigment = updateMobileClinicAssigment;
const getAllMobileClinicAssigmentsForTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch mobileclinic assignments and include only patient name and phone
        const mobileclinicAssigments = yield prisma.mobileclinicAssignment.findMany({
            where: {
                sheduledAt: {
                    gte: new Date(), // Filter assignments for upcoming dates
                },
            },
            include: {
                Patient: {
                    select: {
                        name: true, // Only select the name field
                        phone: true,
                        nic: true, // Only select the phone field
                    },
                },
            },
        });
        // If needed, filter assignments to only those where patients exist
        const filteredAssignments = mobileclinicAssigments.filter((assignment) => assignment.Patient && assignment.Patient.nic);
        res.status(200).json({
            mobileclinicAssigments: filteredAssignments,
            message: "Mobile Clinic Assigments retrieved successfully!",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting clinics: ${error.message}` });
    }
});
exports.getAllMobileClinicAssigmentsForTable = getAllMobileClinicAssigmentsForTable;
