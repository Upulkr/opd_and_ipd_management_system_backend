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
exports.getAllOutPatients = exports.createOutPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOutPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, name, age, gender, livingStatus, phone, description, reason, city, stateProvince, postalCode, country, streetAddress, prescriptions, } = req.body;
        console.log("req.body", req.body);
        console.log("nic", nic);
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
        res.status(200).json(outPatients);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllOutPatients = getAllOutPatients;
// export const getOutPatientByNic = async (req: Request, res: Response) => {
//   try {
//     const { nic } = req.params;
//     if (!nic) {
//       return res.status(400).json({ error: "NIC is required." });
//     }
//     const outPatient = await prisma.outPatientFrom.findUnique({
//       where: {
//         nic: nic,
//       },
//     });
//     res
//       .status(200)
//       .json({ message: "OutPatient fetched successfully!", outPatient });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error getting OutPatient: ${error.message}` });
//   }
// };
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
