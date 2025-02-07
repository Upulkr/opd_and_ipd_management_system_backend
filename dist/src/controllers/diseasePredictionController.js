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
exports.deleteDiseasePredictionByNic = exports.updateDiseasePredictionByNic = exports.getDiseasePredictionByNic = exports.createDisasePrediction = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDisasePrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing." });
        }
        const { nic, disease, prediction } = req.body;
        const newDisasePrediction = yield prisma.diseasePrediction.create({
            data: {
                nic,
                disease,
                prediction,
            },
        });
        res.status(200).json({
            newDisasePrediction,
            message: "Disase Prediction created successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error saving Disase Prediction." });
    }
});
exports.createDisasePrediction = createDisasePrediction;
const getDiseasePredictionByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    try {
        const disasePrediction = yield prisma.diseasePrediction.findMany({
            where: {
                nic: String(nic),
            },
        });
        if (!disasePrediction) {
            return res.status(404).json({ error: "Disase Prediction not found." });
        }
        res.status(200).json(disasePrediction);
    }
    catch (error) {
        res.status(500).json({ error: "Error getting Disase Prediction." });
    }
});
exports.getDiseasePredictionByNic = getDiseasePredictionByNic;
const updateDiseasePredictionByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, id } = req.params;
    if (!nic) {
        return res.status(400).json({ error: "NIC is required." });
    }
    try {
        const updatedDisasePrediction = yield prisma.diseasePrediction.update({
            where: {
                id: Number(id),
                nic: String(nic),
            },
            data: req.body,
        });
        res.status(200).json({
            updatedDisasePrediction,
            message: "Disase Prediction updated successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error updating Disase Prediction." });
    }
});
exports.updateDiseasePredictionByNic = updateDiseasePredictionByNic;
const deleteDiseasePredictionByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, id } = req.params;
    if (!nic) {
        return res.status(400).json({ error: "NIC is required." });
    }
    try {
        const deletedDisasePrediction = yield prisma.diseasePrediction.delete({
            where: {
                nic: String(nic),
                id: Number(id),
            },
        });
        res.status(200).json({
            deletedDisasePrediction,
            message: "Disase Prediction deleted successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting Disase Prediction." });
    }
});
exports.deleteDiseasePredictionByNic = deleteDiseasePredictionByNic;
