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
exports.updateLabtest = exports.deleteLabtest = exports.getrelatedLabtest = exports.getAllLabtestByNic = exports.getAllLabtests = exports.createLabtest = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLabtest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht, testno, date, test, result } = req.body;
        // Validate input
        if (!nic || !bht || !testno || !date || !test || !result) {
            return res.status(400).json({ error: "All fields are required." });
        }
        // Create the labtest in the database
        const labtest = yield prisma.labtest.create({
            data: {
                nic,
                bht,
                testno,
                date: new Date(date),
                test,
                result,
            },
        });
        // Return the created labtest
        res.status(201).json({
            message: "Lab test created successfully!",
            labtest,
        });
    }
    catch (error) {
        console.error("Error creating lab test:", error);
        res.status(500).json({
            error: "An error occurred while creating the lab test.",
            details: error.message,
        });
    }
});
exports.createLabtest = createLabtest;
const getAllLabtests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all lab tests from the database
        const labtests = yield prisma.labtest.findMany();
        // Return the list of lab tests
        res.status(200).json({
            message: "Lab tests fetched successfully!",
            labtests,
        });
    }
    catch (error) {
        console.error("Error getting lab tests:", error);
        res.status(500).json({
            error: "An error occurred while fetching lab tests.",
            details: error.message,
        });
    }
});
exports.getAllLabtests = getAllLabtests;
const getAllLabtestByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        const labtest = yield prisma.labtest.findMany({
            where: {
                nic: Number(nic),
            },
        });
        res
            .status(200)
            .json({ message: "Lab test fetched successfully!", labtest });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting labtest: ${error.message}` });
    }
});
exports.getAllLabtestByNic = getAllLabtestByNic;
const getrelatedLabtest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic && !bht) {
            return res.status(400).json({ error: "NIC is required." });
        }
        const labtest = yield prisma.labtest.findUnique({
            where: {
                nic: Number(nic),
                bht: Number(bht),
            },
        });
        res
            .status(200)
            .json({ message: "Lab test fetched successfully!", labtest });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting labtest: ${error.message}` });
    }
});
exports.getrelatedLabtest = getrelatedLabtest;
const deleteLabtest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        yield prisma.labtest.deleteMany({
            where: {
                nic: Number(nic),
                bht: Number(bht),
            },
        });
        res.status(200).json({ message: "Lab test deleted successfully!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting labtest: ${error.message}` });
    }
});
exports.deleteLabtest = deleteLabtest;
const updateLabtest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        const { bht, testno, date, test, result } = req.body;
        if (!bht || !testno || !date || !test || !result) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const labtest = yield prisma.labtest.updateMany({
            where: {
                nic: Number(nic),
                bht: Number(bht),
            },
            data: {
                bht,
                testno,
                date: new Date(date),
                test,
                result,
            },
        });
        res.status(200).json({ message: "Lab test updated successfully!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating labtest: ${error.message}` });
    }
});
exports.updateLabtest = updateLabtest;
