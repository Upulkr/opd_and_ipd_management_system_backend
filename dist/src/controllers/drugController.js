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
exports.getDrugAllocationbyWardName = exports.createNewDrugAllocation = exports.getDrugById = exports.updateDrug = exports.deleteDrug = exports.getAllDrugs = exports.addNewDrug = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addNewDrug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { drugName, unit, totalQuantity, expiryDate, remainingQuantity } = req.body;
        if (!drugName || !unit || !totalQuantity || !expiryDate) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const checkIfDrugExists = yield prisma.drugs.findFirst({
            where: {
                drugName,
            },
        });
        if (checkIfDrugExists) {
            return res.status(400).json({ message: "Drug already exists" });
        }
        const newDrug = yield prisma.drugs.create({
            data: {
                drugName,
                unit,
                totalQuantity,
                expiryDate,
            },
        });
        res.status(200).json({ newDrug, message: "Drug added successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: `Error adding Drug: ${error.message}` });
    }
});
exports.addNewDrug = addNewDrug;
const getAllDrugs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drugs = yield prisma.drugs.findMany();
        res.status(200).json({ drugs });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllDrugs = getAllDrugs;
const deleteDrug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { drugId } = req.params;
    try {
        const deletedDrug = yield prisma.drugs.delete({
            where: {
                drugId: Number(drugId),
            },
        });
        res.status(200).json(deletedDrug);
    }
    catch (error) {
        res.status(500).json({ message: `Error deleting Drug: ${error.message}` });
    }
});
exports.deleteDrug = deleteDrug;
const updateDrug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { drugId } = req.params;
        console.log("drugId", drugId);
        if (!drugId) {
            return res.status(400).json({ error: "Drug ID is required." });
        }
        const checkIfDrugExists = yield prisma.drugs.findUnique({
            where: {
                drugId: Number(drugId),
            },
        });
        if (!checkIfDrugExists) {
            return res.status(400).json({ message: "Drug not found" });
        }
        const updatedDrug = yield prisma.drugs.update({
            where: {
                drugId: Number(drugId),
            },
            data: req.body,
        });
        res
            .status(200)
            .json({ message: "Drug updated successfully!", updatedDrug });
    }
    catch (error) {
        res.status(500).json({ message: `Error updating Drug: ${error.message}` });
    }
});
exports.updateDrug = updateDrug;
const getDrugById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { drugId } = req.params;
    try {
        const drug = yield prisma.drugs.findUnique({
            where: {
                drugId: Number(drugId),
            },
        });
        res.status(200).json(drug);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getDrugById = getDrugById;
const createNewDrugAllocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { drugId, drugName, wardName, totalQuantity, usedQuantity, unit, dateGiven, } = req.body;
        if (!drugId || !drugName || !wardName || !totalQuantity) {
            return res.status(400).json({
                message: "Missing required fields: drugId, drugName, wardName, or totalQuantity.",
            });
        }
        const existingAllocation = yield prisma.drugAllocation.findFirst({
            where: {
                drugId,
                wardName,
            },
        });
        if (existingAllocation) {
            const updatedAllocation = yield prisma.drugAllocation.update({
                where: {
                    id: existingAllocation.id,
                },
                data: {
                    totalQuantity: {
                        increment: Number(totalQuantity),
                    },
                },
            });
            yield prisma.drugs.update({
                where: {
                    drugId: Number(drugId),
                },
                data: {
                    totalQuantity: {
                        decrement: Number(totalQuantity),
                    },
                    usedQuantity: {
                        increment: Number(totalQuantity),
                    },
                },
            });
            return res.status(200).json({
                updatedAllocation,
                message: "Drug Allocation updated successfully!",
            });
        }
        const newDrugAllocation = yield prisma.drugAllocation.create({
            data: {
                drugId,
                drugName,
                wardName,
                totalQuantity: Number(totalQuantity),
                usedQuantity,
                unit,
                dateGiven,
            },
        });
        yield prisma.drugs.update({
            where: {
                drugId: Number(drugId),
            },
            data: {
                totalQuantity: {
                    decrement: Number(totalQuantity),
                },
                usedQuantity: {
                    increment: Number(totalQuantity),
                },
            },
        });
        res.status(200).json({
            newDrugAllocation,
            message: "Drug Allocation added successfully!",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error adding Drug Allocation: ${error.message}` });
    }
});
exports.createNewDrugAllocation = createNewDrugAllocation;
const getDrugAllocationbyWardName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardName } = req.params;
        const allocations = yield prisma.drugAllocation.findMany({
            where: {
                wardName,
            },
        });
        res.status(200).json({
            allocations,
            message: "Drug Allocations retrieved succssfulley",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting Drug Allocations: ${error.message}` });
    }
});
exports.getDrugAllocationbyWardName = getDrugAllocationbyWardName;
