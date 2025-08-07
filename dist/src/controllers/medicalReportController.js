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
exports.getMedicalReportByNicandType = exports.getMEdicalRportbyNicandId = exports.getAllMedicalReportbyNic = exports.getMedicalReports = exports.createMedicalReport = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMedicalReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { PatientNic, reportType, documentUrl } = req.body;
    try {
        const medicalReport = yield prisma.medicalreport.create({
            data: {
                PatientNic,
                reportType,
                documentUrl,
            },
        });
        res.status(201).json(medicalReport);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating medical report" });
    }
});
exports.createMedicalReport = createMedicalReport;
const getMedicalReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicalReports = yield prisma.medicalreport.findMany();
        res.status(200).json(medicalReports);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching medical reports" });
    }
});
exports.getMedicalReports = getMedicalReports;
const getAllMedicalReportbyNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { PatientNic } = req.params;
    try {
        const medicalReports = yield prisma.medicalreport.findMany({
            where: {
                PatientNic,
            },
        });
        res.status(200).json(medicalReports);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching medical reports" });
    }
});
exports.getAllMedicalReportbyNic = getAllMedicalReportbyNic;
const getMEdicalRportbyNicandId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { PatientNic, id } = req.params;
    try {
        const medicalReport = yield prisma.medicalreport.findFirst({
            where: {
                PatientNic,
                id: Number(id),
            },
        });
        res.status(200).json(medicalReport);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching medical report" });
    }
});
exports.getMEdicalRportbyNicandId = getMEdicalRportbyNicandId;
const getMedicalReportByNicandType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nic: PatientNic, doctype: reportType } = req.params;
    // Log the PatientNic received in the request
    if (!PatientNic || !reportType) {
        return res
            .status(400)
            .json({ message: "Patient Nic and reportType are required" });
    }
    console.log("reportType", reportType);
    try {
        const medicalReport = yield prisma.medicalreport.findMany({
            where: {
                PatientNic,
                reportType,
            },
        });
        if (!medicalReport || medicalReport.length === 0) {
            return res.status(404).json({ message: "No medical report found" });
        }
        console.log("medicalReport", medicalReport); // Log the fetched medical report
        if (!medicalReport || medicalReport.length === 0) {
            return res.status(404).json({ message: "No medical report found" });
        }
        // Log the fetched medical report
        res.status(200).json(medicalReport);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching medical report" });
    }
});
exports.getMedicalReportByNicandType = getMedicalReportByNicandType;
