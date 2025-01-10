import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOutPatient = async (req: Request, res: Response) => {
  try {
    const {
      nic,
      name,
      age,
      gender,
      livingStatus,
      phone,
      description,
      reason,
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      prescriptions,
    } = req.body;
    console.log("req.body", req.body);
    console.log("nic", nic);
    const newOutPatient = await prisma.outPatientFrom.create({
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllOutPatients = async (req: Request, res: Response) => {
  try {
    const outPatients = await prisma.outPatientFrom.findMany();
    res.status(200).json(outPatients);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

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
