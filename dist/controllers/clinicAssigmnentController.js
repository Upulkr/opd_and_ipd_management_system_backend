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
exports.getAllClinicAssigmentsForTable = exports.deleteClinicAssigment = exports.updateClinicAssigment = exports.getClinicAssigmentById = exports.getAllClinicAssigments = exports.createClinicAssigment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int !== null && int !== void 0 ? int : this.toString();
};
const createClinicAssigment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, clinicId, clinicName } = req.body;
        const checkNicexisits = yield prisma.patient.findUnique({
            where: {
                nic: nic,
            },
        });
        if (!checkNicexisits) {
            return res.status(400).json({ message: "Patient does not registered" });
        }
        const newClinicAssigment = yield prisma.clinicAssignment.create({
            data: {
                nic,
                clinicId: Number(clinicId),
                clinicName,
            },
        });
        res.status(200).json({
            newClinicAssigment,
            message: "Clinic Assigment created successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error creating clinic:${error.message}` });
    }
});
exports.createClinicAssigment = createClinicAssigment;
const getAllClinicAssigments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clinicAssigments = yield prisma.clinicAssignment.findMany();
        res.status(200).json({
            clinicAssigments,
            message: "Clinic Assigments retrieved successfully!",
        });
    }
    catch (error) {
        error
            .status(500)
            .json({ message: `Error getting clinics:${error.message}` });
    }
});
exports.getAllClinicAssigments = getAllClinicAssigments;
const getClinicAssigmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const clinicAssigment = yield prisma.clinicAssignment.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json({
            clinicAssigment,
            message: "Clinic Assigment retrieved successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error getting clinics:${error.message}` });
    }
});
exports.getClinicAssigmentById = getClinicAssigmentById;
const updateClinicAssigment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedClinicAssigment = yield prisma.clinicAssignment.update({
            where: {
                id: Number(id),
            },
            data: req.body,
        });
        res.status(200).json({
            updatedClinicAssigment,
            message: "Clinic Assigment updated successfully!",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating clinics:${error.message}` });
    }
});
exports.updateClinicAssigment = updateClinicAssigment;
const deleteClinicAssigment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedClinicAssigment = yield prisma.clinicAssignment.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json({
            deletedClinicAssigment,
            message: "Clinic Assigment deleted successfully!",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting clinics:${error.message}` });
    }
});
exports.deleteClinicAssigment = deleteClinicAssigment;
const getAllClinicAssigmentsForTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clinicAssigments = yield prisma.$queryRaw `select count(nic) as noOfpatients,ca."clinicName" ,cl."location",cl."doctorName",cl."sheduledAt" from clinic as cl
inner join "clinicAssignment" as ca on ca."clinicId" =cl.id group by ca."clinicId",ca."clinicName",cl."location",cl."doctorName",cl."sheduledAt";`;
        res.status(200).json({
            clinicAssigments,
            message: "Clinic Assigments retrieved successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error getting clinics:${error.message}` });
    }
});
exports.getAllClinicAssigmentsForTable = getAllClinicAssigmentsForTable;
