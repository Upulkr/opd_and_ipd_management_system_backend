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
exports.updatePatient = exports.deletePatient = exports.getPatientByNic = exports.getAllPatients = exports.createPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, age, name, gender, address, phone, diagnose, reason, pressure, weight, } = req.body;
        const patient = yield prisma.patient.findUnique({
            where: {
                nic,
            },
        });
        if (patient) {
            return res.status(400).json({ message: "Patient already exists" });
        }
        const newPatient = yield prisma.patient.create({
            data: {
                nic,
                age,
                name,
                gender,
                address,
                phone,
                reason,
            },
        });
        res
            .status(200)
            .json({ message: "Patient Created Successfully", newPatient });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating Patient: ${error.message}` });
    }
});
exports.createPatient = createPatient;
const getAllPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Patients = yield prisma.patient.findMany();
        res
            .status(200)
            .json({ message: "Patients fetched successfully!", Patients });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting Patients: ${error.message}` });
    }
});
exports.getAllPatients = getAllPatients;
const getPatientByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    try {
        const Patient = yield prisma.patient.findUnique({
            where: {
                nic,
            },
        });
        if (!Patient) {
            // Respond with a 404 if the patient is not found
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json({ message: "Patient fetched successfully!", Patient });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting Patient: ${error.message}` });
    }
});
exports.getPatientByNic = getPatientByNic;
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    if (!nic) {
        return res.status(400).json({ message: "nic is required" });
    }
    try {
        const deletedPatient = yield prisma.patient.delete({
            where: {
                nic,
            },
        });
        res.status(200).json({
            message: "Patient Deleted Successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting Patient: ${error.message}` });
    }
});
exports.deletePatient = deletePatient;
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic } = req.params;
    if (!nic) {
        return res.status(400).json({ message: "nic is required" });
    }
    try {
        const updatedPatient = yield prisma.patient.update({
            where: {
                nic,
            },
            data: req.body,
        });
        res.status(200).json({
            message: "Patient Updated Successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating Patient: ${error.message}` });
    }
});
exports.updatePatient = updatePatient;
