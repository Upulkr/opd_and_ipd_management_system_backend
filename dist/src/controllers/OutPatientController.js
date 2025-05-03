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
exports.getStaffMemebers = exports.getOutPatientByNic = exports.getNumberOfOutPatientsToday = exports.getAllOutPatientsToday = exports.getAllOutPatients = exports.createOutPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOutPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, name, age, gender, livingStatus, phone, description, reason, city, stateProvince, postalCode, country, streetAddress, prescriptions, } = req.body;
        const checkNIC = yield prisma.patient.findUnique({
            where: {
                nic,
            },
        });
        if (!checkNIC) {
            console.log("NIC is not available");
            return res.status(400).json({ message: "NIC is not available" });
        }
        const newOutPatient = yield prisma.outPatientFrom.create({
            data: {
                nic,
                name,
                age,
                gender,
                prescriptions,
                phone,
                description,
                reason,
                city,
                stateProvince,
                postalCode,
                country,
                streetAddress,
                livingStatus: "active", // or any default value
            },
        });
        res.status(201).json({
            message: "OutPatient Created Successfully",
            newOutPatient,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createOutPatient = createOutPatient;
const getAllOutPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const outPatients = yield prisma.outPatientFrom.findMany();
        if (!outPatients.length) {
            return res.status(404).json({ message: "No OutPatients found." });
        }
        console.log("outPatients", outPatients);
        res.status(200).json(outPatients);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllOutPatients = getAllOutPatients;
const getAllOutPatientsToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const outPatientsToday = yield prisma.outPatientFrom.findMany();
        if (!outPatientsToday.length) {
            return res.status(404).json({ message: "No OutPatients found." });
        }
        console.log("outPatientsToday", outPatientsToday);
        res.status(200).json(outPatientsToday);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllOutPatientsToday = getAllOutPatientsToday;
const getNumberOfOutPatientsToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const outPatientsTodayCount = yield prisma.outPatientFrom.count({
            where: {
                createdAt: {
                    gte: startOfDay, // Greater than or equal to the start of the day
                    lte: endOfDay, // Less than or equal to the end of the day
                },
            },
        });
        res.status(200).json(outPatientsTodayCount);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getNumberOfOutPatientsToday = getNumberOfOutPatientsToday;
const getOutPatientByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        const outPatient = yield prisma.outPatientFrom.findMany({
            where: {
                nic: nic,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        if (!outPatient.length) {
            return res.status(404).json({ message: "OutPatient not found." });
        }
        res
            .status(200)
            .json({ message: "OutPatient fetched successfully!", outPatient });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting OutPatient: ${error.message}` });
    }
});
exports.getOutPatientByNic = getOutPatientByNic;
const getStaffMemebers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffOutPatient = yield prisma.wardAssignment.findMany({
            where: {
                ward: "Outpatient",
            },
        });
        if (!staffOutPatient.length) {
            return res.status(404).json({ message: "staffOutPatient not found." });
        }
        res.status(200).json({
            message: "staffOutPatient fetched successfully!",
            staffOutPatient,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting OutPatient: ${error.message}` });
    }
});
exports.getStaffMemebers = getStaffMemebers;
// export const updateOutPatient = async (req: Request, res: Response) => {
//   try {
//     const { nic } = req.params;
//     if (!nic) {
//       return res.status(400).json({ error: "NIC is required." });
//     }
//     const updatedOutPatient = await prisma.outPatientFrom.update({
//       where: {
//         nic,
//       },
//       data: req.body,
//     });
//     res
//       .status(200)
//       .json({ message: "OutPatient updated successfully!", updatedOutPatient });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error updating OutPatient: ${error.message}` });
//   }
// };
// export const deleteOutPatient = async (req: Request, res: Response) => {
//   try {
//     const { nic } = req.params;
//     if (!nic) {
//       return res.status(400).json({ error: "NIC is required." });
//     }
//     const deletedOutPatient = await prisma.outPatientFrom.delete({
//       where: {
//         nic,
//       },
//     });
//     res
//       .status(200)
//       .json({ message: "OutPatient deleted successfully!", deletedOutPatient });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error deleting OutPatient: ${error.message}` });
//   }
// };
