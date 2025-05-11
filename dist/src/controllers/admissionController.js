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
exports.admissioBookById = exports.admissionSheeetById = exports.getadmiisionsGeneralDetails = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getadmiisionsGeneralDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        const patientExists = yield prisma.patient.findUnique({
            where: {
                nic,
            },
        });
        if (!patientExists) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const admissionSheets = yield prisma.admissionSheet.findMany({
            where: {
                nic,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                createdAt: true,
                bht: true,
            },
        });
        const admissionbooks = yield prisma.admissionbook.findMany({
            where: {
                nic,
                bht: {
                    in: admissionSheets.map((admissionSheet) => admissionSheet.bht),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                bht: true,
            },
        });
        const combinedAdmissionData = admissionSheets.map((admissionSheet) => {
            var _a;
            return ({
                date: admissionSheet.createdAt,
                bht: admissionSheet.bht,
                admissionSheetId: admissionSheet.id,
                admissionBookId: (_a = admissionbooks.find((book) => book.bht == admissionSheet.bht)) === null || _a === void 0 ? void 0 : _a.id,
            });
        });
        res.status(200).json({ combinedAdmissionData });
    }
    catch (error) { }
});
exports.getadmiisionsGeneralDetails = getadmiisionsGeneralDetails;
const admissionSheeetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        }
        const admissionSheet = yield prisma.admissionSheet.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json({ admissionSheet });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching admission sheet" });
    }
});
exports.admissionSheeetById = admissionSheeetById;
const admissioBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        }
        const admissionSheet = yield prisma.admissionbook.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json({ admissionSheet });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching admission book" });
    }
});
exports.admissioBookById = admissioBookById;
