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
exports.deleteAdmissionBook = exports.updateAdmissionBook = exports.getAllAdmissionBooksforNic = exports.getrelatedAdmissionBook = exports.getAdmissionBooks = exports.createAdmissionBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAdmissionBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht, name, dailyno, yearlyno, address, age, admittedDate, reason, allergies, transin, transout, direct, } = req.body;
        const newAdmissionBook = yield prisma.admissionbook.create({
            data: {
                nic,
                bht,
                name,
                dailyno,
                yearlyno,
                address,
                age,
                admittedDate,
                reason,
                allergies,
                transin,
                transout,
                direct,
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
const getrelatedAdmissionBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, bht } = req.params;
    try {
        const admissionBook = yield prisma.admissionbook.findUnique({
            where: {
                nic: Number(nic),
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
exports.getrelatedAdmissionBook = getrelatedAdmissionBook;
const getAllAdmissionBooksforNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, bht } = req.params;
    try {
        const admissionBook = yield prisma.admissionbook.findMany({
            where: {
                nic: Number(nic),
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
        const { bht, name, dailyno, yearlyno, address, age, admittedDate, reason, allergies, transin, transout, direct, } = req.body;
        const updatedAdmissionBook = yield prisma.admissionbook.update({
            where: {
                nic: Number(nic),
                bht: Number(bht),
            },
            data: {
                bht,
                name,
                dailyno,
                yearlyno,
                address,
                age,
                admittedDate,
                reason,
                allergies,
                transin,
                transout,
                direct,
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
                nic: Number(nic),
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
