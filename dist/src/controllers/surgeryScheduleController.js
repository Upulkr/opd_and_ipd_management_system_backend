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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurgeryScheduleById = exports.getAllSurgerySchedules = exports.deleteSurgerySchedule = exports.updateSurgerySchedule = exports.createSurgerySchedule = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const createSurgerySchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PatientNic, patientName, surgeryName, ScheduledDate, PatientPhonenUmber, } = req.body;
        if (!PatientNic ||
            !patientName ||
            !ScheduledDate ||
            !PatientPhonenUmber ||
            !surgeryName) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }
        const isoSheduledAt = new Date(ScheduledDate).toISOString();
        const utcSheduledAt = (0, dayjs_1.default)(isoSheduledAt)
            .tz("Asia/Colombo", true)
            .utc()
            .toDate();
        const checkPatientRegistered = yield prisma.patient.findUnique({
            where: {
                nic: String(PatientNic),
            },
        });
        if (!checkPatientRegistered) {
            return res.status(404).json({
                message: "Patient not registered",
            });
        }
        // Check if the patient is already scheduled for surgery on the same date
        const existingSurgery = yield prisma.surgery.findFirst({
            where: {
                PatientNic: String(PatientNic),
                ScheduledDate: utcSheduledAt,
            },
        });
        if (existingSurgery) {
            console.log("Patient is already scheduled for surgery on the same date");
            return res.status(400).json({
                message: "Patient is already scheduled for surgery on the same date",
            });
        }
        if (checkPatientRegistered) {
            const surgerySchedule = yield prisma.surgery.create({
                data: Object.assign(Object.assign({}, req.body), { ScheduledDate: utcSheduledAt, PatientNic: String(req.body.PatientNic) }),
            });
            res.status(200).json(surgerySchedule);
        }
    }
    catch (error) {
        res.status(500).json({
            message: `Error creating Surgery Schedule: ${error.message}`,
        });
    }
});
exports.createSurgerySchedule = createSurgerySchedule;
const updateSurgerySchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate request body
        if (!id) {
            return res.status(400).json({
                message: "Id is required.",
            });
        }
        const { PatientNic, patientName, surgeryName, ScheduledDate, PatientPhonenUmber, } = req.body;
        if (!PatientNic ||
            !patientName ||
            !ScheduledDate ||
            !PatientPhonenUmber ||
            !surgeryName) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }
        // Check if surgery schedule exists
        const existingSurgery = yield prisma.surgery.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!existingSurgery) {
            return res.status(404).json({
                message: "Surgery schedule not found",
            });
        }
        // If request includes a NIC and it's different, verify that patient exists
        // if (req.body.nic && req.body.nic !== existingSurgery.PatientNic) {
        //   const checkPatientRegistered = await prisma.patient.findUnique({
        //     where: {
        //       nic: req.body.nic,
        //     },
        //   });
        //   if (!checkPatientRegistered) {
        //     return res.status(404).json({
        //       message: "Patient not registered",
        //     });
        //   }
        // }
        // Update the surgery schedule
        const isoSheduledAt = new Date(ScheduledDate).toISOString();
        const utcSheduledAt = (0, dayjs_1.default)(isoSheduledAt)
            .tz("Asia/Colombo", true)
            .utc()
            .toDate();
        const updatedSurgery = yield prisma.surgery.update({
            where: {
                id: parseInt(id),
            },
            data: Object.assign(Object.assign({}, req.body), { ScheduledDate: utcSheduledAt, PatientNic: String(req.body.PatientNic) }),
        });
        res.status(200).json(updatedSurgery);
    }
    catch (error) {
        res.status(500).json({
            message: `Error updating surgery schedule: ${error.message}`,
        });
    }
});
exports.updateSurgerySchedule = updateSurgerySchedule;
// DELETE - Delete a surgery schedule
const deleteSurgerySchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if surgery schedule exists
        const existingSurgery = yield prisma.surgery.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!existingSurgery) {
            return res.status(404).json({
                message: "Surgery schedule not found",
            });
        }
        // Delete the surgery schedule
        yield prisma.surgery.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({
            message: "Surgery schedule deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Error deleting surgery schedule: ${error.message}`,
        });
    }
});
exports.deleteSurgerySchedule = deleteSurgerySchedule;
const getAllSurgerySchedules = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surgeries = yield prisma.surgery.findMany({
            orderBy: {
                ScheduledDate: "asc",
            },
        });
        res.status(200).json(surgeries);
    }
    catch (error) {
        res.status(500).json({
            message: `Error fetching surgery schedules: ${error.message}`,
        });
    }
});
exports.getAllSurgerySchedules = getAllSurgerySchedules;
// READ - Get a specific surgery schedule by ID
const getSurgeryScheduleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const surgery = yield prisma.surgery.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!surgery) {
            return res.status(404).json({
                message: "Surgery schedule not found",
            });
        }
        res.status(200).json(surgery);
    }
    catch (error) {
        res.status(500).json({
            message: `Error fetching surgery schedule: ${error.message}`,
        });
    }
});
exports.getSurgeryScheduleById = getSurgeryScheduleById;
