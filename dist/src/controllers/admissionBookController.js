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
exports.getDischargeCounts = exports.getNumberOfAdmissionBooksToday = exports.deleteAdmissionBook = exports.updateAdmissionBook = exports.getAllAdmissionBooksforNic = exports.getrelatedAdmissionBookbyBHT = exports.getAdmissionBooks = exports.createAdmissionBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAdmissionBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht, name, dailyno, yearlyno, city, stateProvince, postalCode, country, streetAddress, age, admittedDate, reason, allergies, phone, transferCategory, dischargeDate, wardNo, livingStatus, } = req.body;
        const newAdmissionBook = yield prisma.admissionbook.create({
            data: {
                nic,
                bht: Number(bht),
                name,
                dailyno,
                yearlyno,
                city,
                stateProvince,
                postalCode,
                country,
                streetAddress,
                age,
                admittedDate: new Date(admittedDate),
                reason,
                allergies,
                transferCategory,
                phone,
                wardNo,
                livingStatus,
                dischargeDate: dischargeDate ? new Date(dischargeDate) : null,
            },
        });
        res.status(201).json({
            message: "AdmissionBook Created Successfully",
            newAdmissionBook,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Error creating AdmissionBook:  ${error.message}`,
        });
    }
});
exports.createAdmissionBook = createAdmissionBook;
const getAdmissionBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admissionBooks = yield prisma.admissionbook.findMany();
        res.status(200).json(admissionBooks);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting AdmissionBook: ${error.message}` });
    }
});
exports.getAdmissionBooks = getAdmissionBooks;
const getrelatedAdmissionBookbyBHT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bht } = req.query;
    try {
        const admissionBook = yield prisma.admissionbook.findUnique({
            where: {
                bht: Number(bht),
            },
        });
        res.status(200).json({ admissionBook });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting AdmissionBook: ${error.message}` });
    }
});
exports.getrelatedAdmissionBookbyBHT = getrelatedAdmissionBookbyBHT;
const getAllAdmissionBooksforNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, bht } = req.params;
    try {
        const admissionBook = yield prisma.admissionbook.findMany({
            where: {
                nic,
                bht: Number(bht),
            },
        });
        res.status(200).json(admissionBook);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting AdmissionBook: ${error.message}` });
    }
});
exports.getAllAdmissionBooksforNic = getAllAdmissionBooksforNic;
const updateAdmissionBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    if (!nic) {
        return res.status(400).json({ message: "nic is required" });
    }
    try {
        const { nic, bht, name, dailyno, yearlyno, city, stateProvince, postalCode, country, streetAddress, age, admittedDate, reason, allergies, phone, transferCategory, dischargeDate, wardNo, livingStatus, } = req.body;
        const updatedAdmissionBook = yield prisma.admissionbook.update({
            where: {
                nic,
                bht,
            },
            data: {
                nic,
                bht: Number(bht),
                name,
                dailyno,
                yearlyno,
                city,
                stateProvince,
                postalCode,
                country,
                streetAddress,
                age,
                admittedDate: new Date(admittedDate),
                reason,
                allergies,
                transferCategory,
                phone,
                wardNo,
                dischargeDate: new Date(dischargeDate),
            },
        });
        res.status(200).json(updatedAdmissionBook);
    }
    catch (error) {
        res.status(500).json({
            message: `Error updating AdmissionBook: ${error.message}`,
        });
    }
});
exports.updateAdmissionBook = updateAdmissionBook;
const deleteAdmissionBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, bht } = req.params;
    if (!nic) {
        return res.status(400).json({ message: "nic is required" });
    }
    try {
        const deletedAdmissionBook = yield prisma.admissionbook.delete({
            where: {
                nic,
                bht: Number(bht),
            },
        });
        res.status(200).json(deletedAdmissionBook);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting AdmissionBook: ${error.message}` });
    }
});
exports.deleteAdmissionBook = deleteAdmissionBook;
const getNumberOfAdmissionBooksToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const outPatientsTodayCount = yield prisma.admissionbook.count({
            where: {
                createdAt: {
                    gte: startOfDay, // Greater than or equal to the start of the day
                    lte: endOfDay, // Less than or equal to the end of the day
                },
            },
        });
        res.status(200).json(outPatientsTodayCount);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getNumberOfAdmissionBooksToday = getNumberOfAdmissionBooksToday;
const getDischargeCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
        const dischargeCounts = yield prisma.admissionbook.groupBy({
            by: ["dischargeDate"],
            _count: {
                dischargeDate: true,
            },
            where: {
                dischargeDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        res.status(200).json(dischargeCounts);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getDischargeCounts = getDischargeCounts;
