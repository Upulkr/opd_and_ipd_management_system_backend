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
exports.getOutPatientByNic = exports.getAllOutPatients = exports.createOutPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOutPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic, age, name, gender, address, phone, wardNo, reason, pressure, weight, } = req.body;
    try {
        const newOutPatient = yield prisma.outpatient.create({
            data: {
                nic,
                age,
                name,
                gender,
                address,
                phone,
                wardNo,
                reason,
                pressure,
                weight,
            },
        });
        res
            .status(200)
            .json({ message: "Patient Created Successfully", newOutPatient });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating Patient: ${error.message}` });
    }
});
exports.createOutPatient = createOutPatient;
const getAllOutPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const outPatients = yield prisma.outpatient.findMany();
        res.status(200).json({ message: "Patients fetched successfully!", outPatients });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting Patients: ${error.message}` });
    }
});
exports.getAllOutPatients = getAllOutPatients;
const getOutPatientByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    try {
        const outPatient = yield prisma.outpatient.findUnique({
            where: {
                nic: Number(nic),
            },
        });
        res.status(200).json({ message: "Patient fetched successfully!", outPatient });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting Patient: ${error.message}` });
    }
});
exports.getOutPatientByNic = getOutPatientByNic;
deleteOutPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    if (!nic) {
        return res.status(400).json({ message: "nic is required" });
    }
    try {
        const deletedOutPatient = yield prisma.outpatient.delete({
            where: {
                nic: Number(nic),
            },
        });
        res.status(200).json({
            message: "OutPatient Deleted Successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting OutPatient: ${error.message}` });
    }
});
