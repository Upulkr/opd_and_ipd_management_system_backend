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
exports.deleteClinic = exports.updateClinic = exports.getClinicById = exports.getAllClinics = exports.createClininc = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createClininc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, doctorName, location, sheduledAt } = req.body;
        const isoSheduledAt = new Date(sheduledAt).toISOString();
        const newClinic = yield prisma.clinic.create({
            data: {
                name,
                doctorName,
                location,
                sheduledAt: isoSheduledAt,
            },
        });
        res
            .status(200)
            .json({ newClinic, message: "Clinic created successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: `Error creating clinic:${error.message}` });
    }
});
exports.createClininc = createClininc;
const getAllClinics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clinics = yield prisma.clinic.findMany();
        res
            .status(200)
            .json({ clinics, message: "Clinics retrieved successfully!" });
    }
    catch (error) {
        error
            .status(500)
            .json({ message: `Error getting clinics:${error.message}` });
    }
});
exports.getAllClinics = getAllClinics;
const getClinicById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json({ clinic, message: "Clinic retrieved successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: `Error getting clinics:${error.message}` });
    }
});
exports.getClinicById = getClinicById;
const updateClinic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedClinic = yield prisma.clinic.update({
            where: {
                id: Number(id),
            },
            data: req.body,
        });
        res
            .status(200)
            .json({ updatedClinic, message: "Clinic updated successfully!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating clinics:${error.message}` });
    }
});
exports.updateClinic = updateClinic;
const deleteClinic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedClinic = yield prisma.clinic.delete({
            where: {
                id: Number(id),
            },
        });
        res
            .status(200)
            .json({ deletedClinic, message: "Clinic deleted successfully!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting clinics:${error.message}` });
    }
});
exports.deleteClinic = deleteClinic;
