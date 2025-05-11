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
exports.updateDrugChart = exports.deleteDrugChart = exports.getAllDrugChartByNic = exports.getrelatedDrugChart = exports.getDrugCharts = exports.createDrugChart = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDrugChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, nic, bht, dose, frequency, date } = req.body;
        if (!name || !nic || !bht || !dose || !frequency || !date) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const newDrugChart = yield prisma.drugChart.create({
            data: {
                name,
                nic,
                bht,
                dose,
                frequency,
                date,
            },
        });
        res.status(201).json(newDrugChart);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating DrugChart: ${error.message}` });
    }
});
exports.createDrugChart = createDrugChart;
const getDrugCharts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drugCharts = yield prisma.drugChart.findMany();
        res.status(200).json(drugCharts);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting DrugChart: ${error.message}` });
    }
});
exports.getDrugCharts = getDrugCharts;
const getrelatedDrugChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        const drugChart = yield prisma.drugChart.findUnique({
            where: {
                nic,
                bht: Number(bht),
            },
        });
        res.status(200).json(drugChart);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting DrugChart: ${error.message}` });
    }
});
exports.getrelatedDrugChart = getrelatedDrugChart;
const getAllDrugChartByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        const drugChart = yield prisma.drugChart.findMany({
            where: {
                nic,
            },
        });
        res.status(200).json(drugChart);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting DrugChart: ${error.message}` });
    }
});
exports.getAllDrugChartByNic = getAllDrugChartByNic;
const deleteDrugChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "ID is required." });
        }
        const drugChart = yield prisma.drugChart.delete({
            where: {
                nic,
                bht: Number(bht),
            },
        });
        res.status(200).json(drugChart);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting DrugChart: ${error.message}` });
    }
});
exports.deleteDrugChart = deleteDrugChart;
const updateDrugChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "ID is required." });
        }
        const { dose, frequency, date } = req.body;
        const updatedDrugChart = yield prisma.drugChart.update({
            where: {
                nic,
                bht: Number(bht),
            },
            data: {
                dose,
                frequency,
                date,
            },
        });
        res.status(200).json(updatedDrugChart);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating DrugChart: ${error.message}` });
    }
});
exports.updateDrugChart = updateDrugChart;
