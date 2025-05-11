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
exports.getNumberOfAdmissionSheetsperDay = exports.getNumberOfAdmissionSheetsperYear = exports.getrelatedAdmissionSheetByBht = exports.getAllAdmissionSheetByNic = exports.deleteAdmissionSheet = exports.getAdmissionSheets = exports.updateAdmissionSheet = exports.createAdmissionSheet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAdmissionSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, name, age, gender, phone, wardNo, reason, pressure, weight, bht, streetAddress, city, stateProvince, postalCode, country, livingStatus, } = req.body;
        const newAdmissionSheet = yield prisma.admissionSheet.create({
            data: {
                nic,
                name,
                age,
                gender,
                phone,
                wardNo,
                reason,
                pressure,
                weight,
                bht: Number(bht),
                streetAddress,
                city,
                stateProvince,
                postalCode,
                country,
                livingStatus,
            },
        });
        res.status(201).json({
            message: "AdmissionSheet Created Successfully",
            newAdmissionSheet,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Error creating AdmissionSheet:  ${error.message}`,
        });
    }
});
exports.createAdmissionSheet = createAdmissionSheet;
const updateAdmissionSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, name, age, gender, bht, phone, wardNo, reason, pressure, weight, livingStatus, } = req.body;
        const updatedAdmissionSheet = yield prisma.admissionSheet.update({
            where: {
                nic: nic,
                bht: Number(bht),
            },
            data: {
                age,
                name,
                gender,
                phone,
                wardNo,
                reason,
                pressure,
                weight,
                livingStatus,
            },
        });
        res.status(200).json({
            message: "AdmissionSheet Updated Successfully",
            updatedAdmissionSheet,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Error updating AdmissionSheet ${error.message}`,
        });
    }
});
exports.updateAdmissionSheet = updateAdmissionSheet;
const getAdmissionSheets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admissionSheets = yield prisma.admissionSheet.findMany();
        res.json(admissionSheets);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving admissionSheets: ${error.message}` });
    }
});
exports.getAdmissionSheets = getAdmissionSheets;
const deleteAdmissionSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ message: "nic is required" });
        }
        const deletedAdmissionSheet = yield prisma.admissionSheet.delete({
            where: {
                nic,
                bht: Number(bht),
            },
        });
        res.status(200).json({
            message: "AdmissionSheet Deleted Successfully",
            deletedAdmissionSheet,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Error deleting AdmissionSheet: ${error.message}`,
        });
    }
});
exports.deleteAdmissionSheet = deleteAdmissionSheet;
const getAllAdmissionSheetByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        if (!nic) {
            return res.status(400).json({ message: "nic is required" });
        }
        const admissionSheet = yield prisma.admissionSheet.findMany({
            where: {
                nic,
            },
        });
        res.status(200).json(admissionSheet);
    }
    catch (error) {
        res.status(500).json({
            message: `Error getting AdmissionSheet: ${error.message}`,
        });
    }
});
exports.getAllAdmissionSheetByNic = getAllAdmissionSheetByNic;
const getrelatedAdmissionSheetByBht = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bht } = req.query;
        if (!bht) {
            return res.status(400).json({ message: "BHT is required" });
        }
        // Try findFirst instead of findUnique if bht is not a unique field
        const admissionSheet = yield prisma.admissionSheet.findUnique({
            where: {
                bht: Number(bht),
            },
        });
        if (!admissionSheet) {
            return res
                .status(404)
                .json({ message: "No admission sheet found for the given BHT" });
        }
        res.status(200).json({ admissionSheet });
    }
    catch (error) {
        console.error("Error fetching admission sheet:", error);
        res.status(500).json({
            message: `Error getting admission sheet: ${error.message}`,
        });
    }
});
exports.getrelatedAdmissionSheetByBht = getrelatedAdmissionSheetByBht;
const getNumberOfAdmissionSheetsperYear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield prisma.$queryRaw `
      SELECT count(name) 
      FROM "AdmissionSheet"
      WHERE EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE);
    `;
        // Convert result to handle BigInt
        const NoOfAdmissionSheetsPerYear = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.count.toString(); // Convert BigInt to string
        res.status(200).json({ NoOfAdmissionSheetsPerYear });
    }
    catch (error) {
        res.status(500).json({
            message: `Error getting number of admission sheets per year: ${error.message}`,
        });
    }
});
exports.getNumberOfAdmissionSheetsperYear = getNumberOfAdmissionSheetsperYear;
const getNumberOfAdmissionSheetsperDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield prisma.$queryRaw `SELECT count(name)
FROM "AdmissionSheet"
WHERE DATE_TRUNC('day', "createdAt") =CURRENT_DATE;`;
        const NoOfAdmissionSheetsPerDay = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.count.toString(); // Convert BigInt to string
        res.status(200).json({ NoOfAdmissionSheetsPerDay });
    }
    catch (error) {
        res.status(500).json({
            message: `Error getting number of admission sheets per year: ${error.message}`,
        });
    }
});
exports.getNumberOfAdmissionSheetsperDay = getNumberOfAdmissionSheetsperDay;
