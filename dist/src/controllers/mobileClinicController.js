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
exports.getMothlyMobileClinicCount = exports.getCountOfCompletedMobileClinicsFor30days = exports.updateMobileClinincCompletedStatus = exports.getAllMobileClinicAssigmentsForTable = exports.updateMobileClinicAssigment = exports.deleteMobileClinicAssigment = exports.getAllMobileClinics = exports.createMObileClinic = void 0;
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
                status: {
                    equals: "pending",
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
const updateMobileClinincCompletedStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectedRows } = req.body;
        // Validate that selectedRows is an array
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            return res.status(400).json({
                message: "'selectedRows' must be a non-empty array.",
            });
        }
        // Map over the array and ensure each entry has `nic` and `id`
        const validRows = selectedRows.filter((row) => row.nic && row.id && !isNaN(Number(row.id)));
        if (validRows.length === 0) {
            return res.status(400).json({
                message: "'selectedRows' contains invalid data.",
            });
        }
        // Update each record in the database
        const updatePromises = validRows.map((row) => prisma.mobileclinicAssignment.updateMany({
            where: {
                nic: row.nic,
                id: Number(row.id),
            },
            data: {
                status: "completed",
            },
        }));
        const updatedMobileClinics = yield Promise.all(updatePromises);
        res.status(200).json({
            updatedMobileClinics,
            message: "Mobile clinics updated successfully!",
        });
    }
    catch (error) {
        console.error("Error updating mobile clinics:", error);
        res
            .status(500)
            .json({ message: `Error updating mobile clinics: ${error.message}` });
    }
});
exports.updateMobileClinincCompletedStatus = updateMobileClinincCompletedStatus;
const getCountOfCompletedMobileClinicsFor30days = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Calculate the date 30 days ago from today
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        // Query Prisma for completed mobile clinics with a scheduled date 30 days ago
        const completedMobileClinics = yield prisma.mobileclinicAssignment.count({
            where: {
                status: "completed",
                sheduledAt: {
                    gte: thirtyDaysAgo, // Filter clinics scheduled from 30 days ago onwards
                },
            },
        });
        const totalcompletedMobileClinics = yield prisma.mobileclinicAssignment.count({
            where: {
                status: "completed",
            },
        });
        res
            .status(200)
            .json({ completedMobileClinics, totalcompletedMobileClinics });
    }
    catch (error) {
        console.error("Error updating mobile clinics:", error);
        res
            .status(500)
            .json({ message: `Error updating mobile clinics: ${error.message}` });
    }
});
exports.getCountOfCompletedMobileClinicsFor30days = getCountOfCompletedMobileClinicsFor30days;
const getMothlyMobileClinicCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const monthlyhomevisits = yield prisma.$queryRaw `SELECT 
    TO_CHAR("updatedAt", 'Month') AS month,  -- Format the date as full month name
    COUNT("id") AS count                     -- Count the number of rows for each month
FROM 
    "MobileclinicAssignment" AS mb
WHERE 
    mb.status = 'completed' AND
    EXTRACT(YEAR FROM "updatedAt") = EXTRACT(YEAR FROM CURRENT_DATE)  -- Filter for the current year
GROUP BY 
    TO_CHAR("updatedAt", 'Month')           -- Group by the full month name
ORDER BY 
    MIN("updatedAt");  `;
        res.status(200).json({ monthlyhomevisits });
    }
    catch (error) {
        console.error("Error updating mobile clinics:", error);
        res
            .status(500)
            .json({ message: `Error updating mobile clinics: ${error.message}` });
    }
});
exports.getMothlyMobileClinicCount = getMothlyMobileClinicCount;
